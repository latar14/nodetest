import fetch from 'node-fetch';

const WB_KAZAN = 117986;
const URL_PARSE = 'https://card.wb.ru/cards/detail?appType=1&curr=rub&dest=-444908&regions=80,38,83,4,64,33,68,70,30,40,86,75,69,1,66,110,48,22,31,71,114&spp=31&nm=138590435;94340606;94339119;138593051;94340317;138607462;94339244'
async function dataParse() {
  const productList = await fetch(URL_PARSE, {
    method: 'GET',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then(({ data: { products } }) => products);

  const wbreserve = productList.map((product) => {
    const reserveSizes = product.sizes.reduce((newObj, size) => {
      const reserveQty = size.stocks.find((reserve) => reserve.wh === WB_KAZAN)?.qty;

      return reserveQty ? { ...newObj, [size.name]: reserveQty } : newObj;
    }, {});

    return {
      art: product.id,
      ...reserveSizes,
    };
  });

  return wbreserve;
}

async function startApp() {
  try {
    console.log(await dataParse());
  } catch (e) {
    console.log(e);
  }
}

startApp();
