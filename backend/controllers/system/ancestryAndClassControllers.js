'use strict';

const systemService = require("../../services/systemService");
const {
    raceSchema,
    classSchema,
    subclassSchema,
    raceAbilitySchema,
    subraceSchema,
    subraceAbilitySchema
} = require("../../schemas/systemSchemas");

const getAllRaces = async (req, res) => {
    try {
        const races = await systemService.getAllRaces();
        return res.status(200).json(races);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching races", error: err });
    }
};

const getRaceById = async (req, res) => {
    try {
        const race = await systemService.getRaceById(req.params.id);
        if (!race) {
            return res.status(404).json({ message: "Race not found" });
        }
        return res.status(200).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race", error: err });
    }
};

const createRace = async (req, res) => {
    try {
        const data = raceSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const race = await systemService.createRace(data.data);
        return res.status(201).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error creating race", error: err });
    }
};

const updateRace = async (req, res) => {
    try {
        const data = raceSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const race = await systemService.updateRace(req.params.id, data.data);
        return res.status(200).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error updating race", error: err });
    }
};

const deleteRace = async (req, res) => {
    try {
        await systemService.deleteRace(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting race", error: err });
    }
};

const getAllClasses = async (req, res) => {
    try {
        const classes = await systemService.getAllClasses();
        return res.status(200).json(classes);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching classes", error: err });
    }
};

const getClassById = async (req, res) => {
    try {
        const classData = await systemService.getClassById(req.params.id);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        return res.status(200).json(classData);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching class", error: err });
    }
};

const createClass = async (req, res) => {
    try {
        const data = classSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const classData = await systemService.createClass(data.data);
        return res.status(201).json(classData);
    } catch (err) {
        return res.status(500).json({ message: "Error creating class", error: err });
    }
};

const updateClass = async (req, res) => {
    try {
        const data = classSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const classData = await systemService.updateClass(req.params.id, data.data);
        return res.status(200).json(classData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating class", error: err });
    }
};

const deleteClass = async (req, res) => {
    try {
        await systemService.deleteClass(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting class", error: err });
    }
};

const getAllSubclasses = async (req, res) => {
    try {
        const subclasses = await systemService.getAllSubclasses();
        return res.status(200).json(subclasses);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subclasses", error: err });
    }
};

const getSubclassById = async (req, res) => {
    try {
        const subclass = await systemService.getSubclassById(req.params.id);
        if (!subclass) {
            return res.status(404).json({ message: "Subclass not found" });
        }
        return res.status(200).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subclass", error: err });
    }
};

const createSubclass = async (req, res) => {
    try {
        const data = subclassSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subclass = await systemService.createSubclass(data.data);
        return res.status(201).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error creating subclass", error: err });
    }
};

const updateSubclass = async (req, res) => {
    try {
        const data = subclassSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subclass = await systemService.updateSubclass(req.params.id, data.data);
        return res.status(200).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subclass", error: err });
    }
};

const deleteSubclass = async (req, res) => {
    try {
        await systemService.deleteSubclass(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subclass", error: err });
    }
};

const getAllRaceAbilities = async (req, res) => {
    try {
        const raceAbilities = await systemService.getAllRaceAbilities();
        return res.status(200).json(raceAbilities);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race abilities", error: err });
    }
};

const getRaceAbilityById = async (req, res) => {
    try {
        const raceAbility = await systemService.getRaceAbilityById(req.params.id);
        if (!raceAbility) {
            return res.status(404).json({ message: "Race ability not found" });
        }
        return res.status(200).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race ability", error: err });
    }
};

const createRaceAbility = async (req, res) => {
    try {
        const data = raceAbilitySchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const raceAbility = await systemService.createRaceAbility(data.data);
        return res.status(201).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error creating race ability", error: err });
    }
};

const updateRaceAbility = async (req, res) => {
    try {
        const data = raceAbilitySchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const raceAbility = await systemService.updateRaceAbility(req.params.id, data.data);
        return res.status(200).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error updating race ability", error: err });
    }
};

const deleteRaceAbility = async (req, res) => {
    try {
        await systemService.deleteRaceAbility(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting race ability", error: err });
    }
};

const getAllSubraces = async (req, res) => {
    try {
        const subraces = await systemService.getAllSubraces();
        return res.status(200).json(subraces);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subraces", error: err });
    }
};

const getSubraceById = async (req, res) => {
    try {
        const subrace = await systemService.getSubraceById(req.params.id);
        if (!subrace) {
            return res.status(404).json({ message: "Subrace not found" });
        }
        return res.status(200).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace", error: err });
    }
};

const createSubrace = async (req, res) => {
    try {
        const data = subraceSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }

        const { error, subrace } = await systemService.createSubrace(data.data);
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(201).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error creating subrace", error: err });
    }
};

const updateSubrace = async (req, res) => {
    try {
        const data = subraceSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subrace = await systemService.updateSubrace(req.params.id, data.data);
        return res.status(200).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subrace", error: err });
    }
};

const deleteSubrace = async (req, res) => {
    try {
        await systemService.deleteSubrace(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subrace", error: err });
    }
};

const getAllSubraceAbilities = async (req, res) => {
    try {
        const subraceAbilities = await systemService.getAllSubraceAbilities();
        return res.status(200).json(subraceAbilities);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace abilities", error: err });
    }
};

const getSubraceAbilityById = async (req, res) => {
    try {
        const subraceAbility = await systemService.getSubraceAbilityById(req.params.id);
        if (!subraceAbility) {
            return res.status(404).json({ message: "Subrace ability not found" });
        }
        return res.status(200).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace ability", error: err });
    }
};

const createSubraceAbility = async (req, res) => {
    try {
        const data = subraceAbilitySchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }

        const { error, subraceAbility } = await systemService.createSubraceAbility(data.data);
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

        return res.status(201).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error creating subrace ability", error: err });
    }
};

const updateSubraceAbility = async (req, res) => {
    try {
        const data = subraceAbilitySchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subraceAbility = await systemService.updateSubraceAbility(req.params.id, data.data);
        return res.status(200).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subrace ability", error: err });
    }
};

const deleteSubraceAbility = async (req, res) => {
    try {
        await systemService.deleteSubraceAbility(req.params.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subrace ability", error: err });
    }
};

module.exports = {
    getAllRaces,
    getRaceById,
    createRace,
    updateRace,
    deleteRace,

    getAllSubraces,
    getSubraceById,
    createSubrace,
    updateSubrace,
    deleteSubrace,

    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,

    getAllSubclasses,
    getSubclassById,
    createSubclass,
    updateSubclass,
    deleteSubclass,

    getAllRaceAbilities,
    getRaceAbilityById,
    createRaceAbility,
    updateRaceAbility,
    deleteRaceAbility,

    getAllSubraceAbilities,
    getSubraceAbilityById,
    createSubraceAbility,
    updateSubraceAbility,
    deleteSubraceAbility,
};
