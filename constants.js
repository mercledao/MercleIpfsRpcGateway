const values = {
  baseDomain: () => {
    if (process.env.ENV.startsWith("prod")) return "https://preprod.mercle.xyz";
    else if (process.env.ENV.startsWith("staging")) return "https://api.timesnap.xyz";
    else if (process.env.ENV.startsWith("local")) return "http://127.0.0.1:3001";
    else return "https://preprod.mercle.xyz";
  },
};

const external = {
  mercle: {
    ipfs: (cid) => `${values.baseDomain()}/ipfs/${cid}`,
    ipns: (cid) => `${values.baseDomain()}/ipns/${cid}`,
  },
};
module.exports = { values, external };
