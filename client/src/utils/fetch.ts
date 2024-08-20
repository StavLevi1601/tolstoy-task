import axios from "axios";
import { UrlSchema } from "../validations/urlSchema.validation";

interface Metadata {
  title: string;
  description: string;
  image: string[];
  url: string;
  error?: string;
}

export const fetchUrls = async (data: UrlSchema): Promise<Metadata[]> => {
  try {
    const response = await axios.post<Metadata[]>(
      `${import.meta.env.VITE_URL_BACKEND}/url`,
      data
    );
    return response.data;
  } catch (e) {
    console.error(e);
    throw e;
  }
};
