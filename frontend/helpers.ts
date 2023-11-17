export function removeDuplicateIds<T extends { id: number }>(
  objects: T[],
): T[] {
  const uniqueObjects = new Map<number, T>();

  for (const obj of objects) {
    uniqueObjects.set(obj.id, obj);
  }

  return Array.from(uniqueObjects.values());
}
