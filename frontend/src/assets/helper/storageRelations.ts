export type AnyObj = { [k: string]: any }

function loadList<T = AnyObj>(key: string): T[] {
  try {
    const raw = sessionStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveList<T = AnyObj>(key: string, list: T[]) {
  try {
    sessionStorage.setItem(key, JSON.stringify(list))
  } catch {
    // ignore
  }
}

/**
 * Add a quest reference (by name or id) to a location entry found by name.
 * This keeps the project's existing convention of storing readable names
 * in the locations' `quests` array while also avoiding duplicates.
 */
export function addQuestReferenceToLocation(locationName: string, questName: string) {
  if (!locationName) return
  const KEY = 'fabularium.campaigns.location_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((l: any) => String(l.name) === String(locationName))
  if (idx === -1) return

  const loc = list[idx]
  loc.quests = Array.isArray(loc.quests) ? loc.quests : []
  if (!loc.quests.includes(questName)) {
    loc.quests.push(questName)
    list[idx] = loc
    saveList(KEY, list)
    try { window.dispatchEvent(new Event('fabularium.locations.updated')) } catch (e) { /* ignore */ }
  }
}

/**
 * Add a quest reference (by name) to an NPC entry found by name.
 */
export function addQuestReferenceToNpc(npcName: string, questName: string) {
  if (!npcName) return
  const KEY = 'fabularium.campaigns.npc_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((n: any) => String(n.name) === String(npcName))
  if (idx === -1) return

  const npc = list[idx]
  npc.quests = Array.isArray(npc.quests) ? npc.quests : []
  if (!npc.quests.includes(questName)) {
    npc.quests.push(questName)
    list[idx] = npc
    saveList(KEY, list)
    try { window.dispatchEvent(new Event('fabularium.npcs.updated')) } catch (e) { /* ignore */ }
  }
}

/**
 * Optional helper: remove quest reference from location/npc by name (not used by default)
 */
export function removeQuestReferenceFromLocation(locationName: string, questName: string) {
  if (!locationName) return
  const KEY = 'fabularium.campaigns.location_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((l: any) => String(l.name) === String(locationName))
  if (idx === -1) return
  const loc = list[idx]
  loc.quests = Array.isArray(loc.quests) ? loc.quests.filter((q: any) => q !== questName) : []
  list[idx] = loc
  saveList(KEY, list)
  try { window.dispatchEvent(new Event('fabularium.locations.updated')) } catch (e) { /* ignore */ }
}

export function addLocationReferenceToQuest(questName: string, locationName: string) {
  if (!questName) return
  const KEY = 'fabularium.campaigns.quest_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((q: any) => String(q.name) === String(questName))
  if (idx === -1) return

  const quest = list[idx]
  quest.locations = Array.isArray(quest.locations) ? quest.locations : []
  if (!quest.locations.includes(locationName)) {
    quest.locations.push(locationName)
    list[idx] = quest
    saveList(KEY, list)
    try { window.dispatchEvent(new Event('fabularium.quests.updated')) } catch (e) { /* ignore */ }
  }
}

export function removeLocationReferenceFromQuest(questName: string, locationName: string) {
  if (!questName) return
  const KEY = 'fabularium.campaigns.quest_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((q: any) => String(q.name) === String(questName))
  if (idx === -1) return
  const quest = list[idx]
  quest.locations = Array.isArray(quest.locations) ? quest.locations.filter((l: any) => l !== locationName) : []
  list[idx] = quest
  saveList(KEY, list)
  try { window.dispatchEvent(new Event('fabularium.quests.updated')) } catch (e) { /* ignore */ }
}

export function addNpcReferenceToQuest(questName: string, npcName: string) {
  if (!questName) return
  const KEY = 'fabularium.campaigns.quest_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((q: any) => String(q.name) === String(questName))
  if (idx === -1) return
  const quest = list[idx]
  quest.npcs = Array.isArray(quest.npcs) ? quest.npcs : []
  if (!quest.npcs.includes(npcName)) {
    quest.npcs.push(npcName)
    list[idx] = quest
    saveList(KEY, list)
    try { window.dispatchEvent(new Event('fabularium.quests.updated')) } catch (e) { /* ignore */ }
  }
}

export function removeNpcReferenceFromQuest(questName: string, npcName: string) {
  if (!questName) return
  const KEY = 'fabularium.campaigns.quest_section'
  const list = loadList<any>(KEY)
  const idx = list.findIndex((q: any) => String(q.name) === String(questName))
  if (idx === -1) return
  const quest = list[idx]
  quest.npcs = Array.isArray(quest.npcs) ? quest.npcs.filter((n: any) => n !== npcName) : []
  list[idx] = quest
  saveList(KEY, list)
  try { window.dispatchEvent(new Event('fabularium.quests.updated')) } catch (e) { /* ignore */ }
}

export default {
  loadList,
  saveList,
  addQuestReferenceToLocation,
  addQuestReferenceToNpc,
  removeQuestReferenceFromLocation
}
