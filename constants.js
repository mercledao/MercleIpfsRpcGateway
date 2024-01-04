const values = {
  baseDomain: () => {
    if (process.env.ENV.startsWith("prod")) return "https://backend.mercle.xyz";
    else if (process.env.ENV.startsWith("staging")) return "https://backendstaging.timesnap.xyz";
    else if (process.env.ENV.startsWith("local")) return "http://127.0.0.1:3001";
    else return "https://backend.mercle.xyz";
  },
};

const external = {
  mercle: {
    ipfs: (cid) => `${values.baseDomain()}/ipfs/${cid}`,
    ipns: (cid) => `${values.baseDomain()}/ipns/${cid}`,
  },
};
module.exports = { values, external };
