export async function getHomeData() {
  try {
    const res = await fetch("http://127.0.0.1:5000/");
    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { error: error.message };
  }
}

export async function getDiningHalls() {
  try {
    const response = await fetch("http://127.0.0.1:5000/dining_halls");
    if (!response.ok) throw new Error(`Failed to fetch dining halls: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("API Error - getDiningHalls:", error);
    return [];
  }
}
