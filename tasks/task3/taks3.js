import dotenv from "dotenv";

dotenv.config();

export const convertJsonFile = async (req, res) => {
  const jsonFile = await getJsonFile();
  const convertedJsonFile = await convertJsonFile(jsonFile);
  res.send(convertedJsonFile);
};

const getJsonFile = async () => {
  const responseJsonFile = await fetch(
    `${process.env.API_URL}/data/${process.env.API_KEY}/json.txt`
  );
  const jsonFile = await responseJsonFile.text();
  console.log(jsonFile);
  return jsonFile;
};
