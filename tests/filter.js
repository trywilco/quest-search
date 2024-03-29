require("dotenv").config();
const axios = require("axios");
const TEN_SECONDS = 10 * 1000;

const getToken = async (client) => {
  const user = {
    user: {
      username: "engine",
      email: "engine@wilco.work",
      password: "wilco1234",
    },
  };

  try {
    const loginRes = await client.post(`/api/users/login`, user);
    if (loginRes.data?.user?.token) {
      return loginRes.data.user.token;
    }
  } catch (e) {
    //User doesn't exists yet
  }

  const userRes = await client.post(`/api/users`, user);
  return userRes.data?.user?.token;
};

const createItem = async (client, itemTitle) => {
  const item = {
    item: {
      title: itemTitle,
      description: "description",
      tag_list: ["tag1"],
    },
  };
  const itemRes = await client.post(`/api/items`, item);
  return itemRes.data?.item;
};

const testItem = async () => {
  const client = axios.create({
    baseURL: `http://localhost:${process.env.PORT || 3000}`,
    timeout: TEN_SECONDS,
  });
  const token = await getToken(client);
  client.defaults.headers.common["Authorization"] = `Token ${token}`;
  await createItem(client, "chocolate chips");
  await createItem(client, "chips");

  const getFilteredItems = await client.get(`/api/items?title=chocolate`);

  if (!getFilteredItems.data?.items) {
    console.log(`=!=!=!=!= ERROR: searched for items with title that contains the word chocolate but didn't find anything although with have an item with the title "chocolate chips"`);
    return false;
  }

  if (getFilteredItems.data?.items.length !== 1) {
    console.log(`=!=!=!=!= ERROR: Wrong number of items filtered - expected to find exactly one item. Are you sure you tested it locally?`);
    return false;
  }

  if (getFilteredItems.data?.items[0].title !== "chocolate chips") {
    console.log(`=!=!=!=!= ERROR: Wrong item was filtered - expected to find the item with the title "chocolate chips" when filtering for "chocolate"`);
    return false;
  }

  return true;
};

testItem()
  .then((res) => process.exit(res ? 0 : 1))
  .catch((e) => {
    console.log("error while checking api: " + e);
    process.exit(1);
  });
