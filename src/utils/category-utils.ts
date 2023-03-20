export const arrayOfStringsValidation = (val: any) => {
  if (!Array.isArray(val))
    throw new Error("Categorynames have to be an array!");

  if (!val.length) throw new Error("Categorynames Array is empty!");

  const isEveryElString = val.every((el) => typeof el === "string");

  if (!isEveryElString) {
    throw new Error("Categorynames array should only icnlude strings in it!");
  }

  return true;
};
