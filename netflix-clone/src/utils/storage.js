const isStorageAvailable = () => {
  try {
    const testKey = "__storage_test__";

    localStorage.setItem(
      testKey,
      "test"
    );

    localStorage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
};

export function saveStorage(
  key,
  value
) {
  if (!key || !isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return true;
  } catch (error) {
    console.error(
      `Failed to save "${key}"`,
      error
    );

    return false;
  }
}

export function getStorage(
  key,
  defaultValue = null
) {
  if (!key || !isStorageAvailable()) {
    return defaultValue;
  }

  try {
    const data =
      localStorage.getItem(key);

    if (data === null) {
      return defaultValue;
    }

    return JSON.parse(data);
  } catch (error) {
    console.error(
      `Failed to read "${key}"`,
      error
    );

    return defaultValue;
  }
}

export function removeStorage(key) {
  if (!key || !isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(
      `Failed to remove "${key}"`,
      error
    );

    return false;
  }
}

export function clearStorage() {
  if (!isStorageAvailable()) {
    return false;
  }

  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error(
      "Failed to clear storage",
      error
    );

    return false;
  }
}

export function hasStorage(key) {
  if (!key || !isStorageAvailable()) {
    return false;
  }

  return localStorage.getItem(key) !== null;
}

export function updateStorage(
  key,
  updater,
  defaultValue = null
) {
  const currentValue = getStorage(
    key,
    defaultValue
  );

  const newValue =
    typeof updater === "function"
      ? updater(currentValue)
      : updater;

  saveStorage(key, newValue);

  return newValue;
}