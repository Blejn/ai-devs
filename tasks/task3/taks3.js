export const convertJsonFile = async (req, res) => {
  const jsonFile = await getJsonFile();
  const convertedJsonFile = await convertJsonFile(jsonFile);
  res.send(convertedJsonFile);
};

const getJsonFile = async () => {
  const responseJsonFile = await fetch(
    "https://centrala.ag3nts.org/data/5e8cc6c9-8828-4d19-9bd3-83fdbc189/json.txt"
  );
  const jsonFile = await responseJsonFile.json();
  console.log(jsonFile);
  return jsonFile;
};
