'use strict';

const {PrismaClient} = require("../generated/prisma/client");
const prisma = new PrismaClient();
const z = require("zod");
const crypto = require("crypto");

const createCampaignSchema = z.object({
	name: z.string().min(1),
	description: z.string().min(1),
	ownerId: z.string()
});

const updateCampaignSchema = z.object({
	id: z.string(),
	name: z.string().min(1).optional(),
	description: z.string().min(1).optional()
});

const generateJoinCodeSchema = z.object({
	id: z.string()
});

const joinCampaignSchema = z.object({
	userId: z.string(),
	joinCode: z.string().min(6)
});

const contributorSchema = z.object({
	campaignId: z.string(),
	userId: z.string()
});


const makeJoinCode = async () => {
	for (let i = 0; i < 30; i++) {
		const code = crypto.randomBytes(6).toString("base64url").slice(0, 10);
		const duplicate = await prisma.campaign.findFirst({ where: { joinCode: code } });
		if (!duplicate) {
            return code;
        }
	}
	throw new Error("Could not generate unique join code after multiple attempts");
};


const createCampaign = async (req, res) => {
	try {
		const data = createCampaignSchema.safeParse(req.body);
        const user = req.user;
		if (!user?.id) {
			return res.status(401).json({ message: "Unauthorized" });
		}
		if (!data.success) {
			return res.status(400).json({ message: "Validation failed", errors: data.error });
		}
		const joinCode = await makeJoinCode();
		const campaign = await prisma.campaign.create({
			data: {
				name: data.data.name,
				description: data.data.description,
				ownerId: user.id,
				joinCode
			},
			include: { owner: true }
		});
		return res.status(201).json(campaign);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to create campaign', error: String(err) });
	}
};

const getCampaigns = async (req, res) => {
	try {
		const campaigns = await prisma.campaign.findMany({
			include: { owner: true, contributors: true }
		});
		return res.status(200).json(campaigns);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list campaigns', error: String(err) });
	}
};

const getCampaignById = async (req, res) => {
	try {
		const id = req.params.id;

		const campaign = await prisma.campaign.findUnique({
			where: { id },
			include: {
				owner: true,
				contributors: true,
				characters: true,
				missions: true,
				notes: true,
				maps: true,
				locations: { include: { npcs: true } },
				npcs: true
			}
		});
		if (!campaign) return res.status(404).json({ message: 'Campaign not found' });
		return res.status(200).json(campaign);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to get campaign', error: String(err) });
	}
};

const updateCampaign = async (req, res) => {
	try {
		const user = req.user;
		const parsed = updateCampaignSchema.safeParse({ ...req.body, id: req.params.id });
		if (!parsed.success) {
			return res.status(400).json({ message: "Validation failed", errors: parsed.error });
		}
		const ownerCheck = await prisma.campaign.findUnique({
			where: { id: parsed.data.id },
			select: { ownerId: true }
		});
		if (!ownerCheck) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		if (ownerCheck.ownerId !== user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		const campaign = await prisma.campaign.update({
			where: { id: parsed.data.id },
			data: {
				name: parsed.data.name,
				description: parsed.data.description
			}
		});
		return res.status(200).json(campaign);
	} catch (err) {
		if (String(err).includes('Record to update not found')) return res.status(404).json({ message: 'Campaign not found' });
		return res.status(500).json({ message: 'Failed to update campaign', error: String(err) });
	}
};

const deleteCampaign = async (req, res) => {
	try {
		const user = req.user;
		const id = req.params.id;
		const ownerCheck = await prisma.campaign.findUnique({ where: { id }, select: { ownerId: true } });
		if (!ownerCheck) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		if (ownerCheck.ownerId !== user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		await prisma.campaign.delete({ where: { id } });
		return res.status(204).send();
	} catch (err) {
		if (String(err).includes('Record to delete does not exist')) return res.status(404).json({ message: 'Campaign not found' });
		return res.status(500).json({ message: 'Failed to delete campaign', error: String(err) });
	}
};

const generateJoinCode = async (req, res) => {
	try {
		const user = req.user;
		const parsed = generateJoinCodeSchema.safeParse({ id: req.params.id });
		if (!parsed.success) {
			return res.status(400).json({ message: "Validation failed", errors: parsed.error });
		}
		const ownerCheck = await prisma.campaign.findUnique({
			where: { id: parsed.data.id },
			select: { ownerId: true }
		});
		if (!ownerCheck) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		if (ownerCheck.ownerId !== user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		const joinCode = await makeJoinCode();
		const campaign = await prisma.campaign.update({
			where: { id: parsed.data.id },
			data: { joinCode },
			select: { id: true, joinCode: true }
		});
		return res.status(200).json(campaign);
	} catch (err) {
		if (String(err).includes('Record to update not found')) return res.status(404).json({ message: 'Campaign not found' });
		return res.status(500).json({ message: 'Failed to generate join code', error: String(err) });
	}
};

const joinCampaignUsingCode = async (req, res) => {
	try {
		const parsed = joinCampaignSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Validation failed", errors: parsed.error });
		}
		const campaign = await prisma.campaign.findFirst({ where: { joinCode: parsed.data.joinCode } });
		if (!campaign) return res.status(404).json({ message: 'Invalid or expired join code' });

		const updated = await prisma.campaign.update({
			where: { id: campaign.id },
			data: {
				contributors: { connect: { id: parsed.data.userId } }
			},
			include: { contributors: true }
		});
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to join campaign', error: String(err) });
	}
};

const addContributor = async (req, res) => {
	try {
		const user = req.user;
		const parsed = contributorSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ message: "Validation failed", errors: parsed.error });
		}
		const ownerCheck = await prisma.campaign.findUnique({
			where: { id: parsed.data.campaignId },
			select: { ownerId: true }
		});
		if (!ownerCheck) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		if (ownerCheck.ownerId !== user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		const updated = await prisma.campaign.update({
			where: { id: parsed.data.campaignId },
			data: { contributors: { connect: { id: parsed.data.userId } } },
			include: { contributors: true }
		});
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to add contributor', error: String(err) });
	}
};

const removeContributor = async (req, res) => {
	try {
		const user = req.user;
		const parsed = contributorSchema.safeParse(req.body);
        
		if (!parsed.success) {
			return res.status(400).json({ message: "Validation failed", errors: parsed.error });
		}
		const ownerCheck = await prisma.campaign.findUnique({
			where: { id: parsed.data.campaignId },
			select: { ownerId: true }
		});
		if (!ownerCheck) {
			return res.status(404).json({ message: 'Campaign not found' });
		}
		if (ownerCheck.ownerId !== user.id) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const updated = await prisma.campaign.update({
			where: { id: parsed.data.campaignId },
			data: { contributors: { disconnect: { id: parsed.data.userId } } },
			include: { contributors: true }
		});
		return res.status(200).json(updated);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to remove contributor', error: String(err) });
	}
};

const listContributors = async (req, res) => {
	try {
		const id = req.params.id;
		if (!z.string().safeParse(id).success) return res.status(400).json({ message: 'Invalid id' });
		const contributors = await prisma.campaign.findUnique({
			where: { id },
			select: { contributors: true }
		});
		if (!contributors) return res.status(404).json({ message: 'Campaign not found' });
		return res.status(200).json(contributors.contributors);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list contributors', error: String(err) });
	}
};

const listCampaignCharacters = async (req, res) => {
	try {
		const id = req.params.id;
		if (!z.string().safeParse(id).success)	{
			return res.status(400).json({ message: 'Invalid id' });
		}
		const chars = await prisma.character.findMany({ where: { campaignId: id } });
		return res.status(200).json(chars);
	} catch (err) {
		return res.status(500).json({ message: 'Failed to list characters', error: String(err) });
	}
};

module.exports = {
	createCampaign,
	getCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
	generateJoinCode,
	joinCampaignUsingCode,
	addContributor,
	removeContributor,
	listContributors,
	listCampaignCharacters
};


