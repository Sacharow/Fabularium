export interface Campaign {
    id: string;
    title: string;
    slug?: string;
    ownerId?: string;
    createdAt?: string;
    updatedAt?: string;
    // section-specific data may be normalized into separate endpoints/tables:
    // notes, characters, locations etc referenced by campaignId
}