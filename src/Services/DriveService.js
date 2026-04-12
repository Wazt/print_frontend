import AXIOS_CONFIG from "@/config/axiosConfig";

export const getDriveFolders = async () => {
  try {
    const response = await AXIOS_CONFIG.get("drive/");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch drive folders:", error);
    throw error;
  }
};

export const getFolderContents = async (folderId) => {
  try {
    const response = await AXIOS_CONFIG.get(`drive/${folderId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch folder contents:", error);
    throw error;
  }
};
