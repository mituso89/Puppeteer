var express = require('express');
const puppeteer = require('puppeteer');
var crawl = require('./../shared/crawlHtml.js');
var product = require('./../shared/product.js');
var router = express.Router();
const proxyChain = require('proxy-chain');





router.get('/',function (req, res,next){
  var url ="";
  var crawlhtml =  crawl.ebay;
  try {
    url= req.query.url;

  } catch (error) {
    console.log('---------------');
  }
  
    run(url,crawlhtml).then((value) => {

        product.item.price = value.price;
        product.item.name = value.name;
        product.item.ratting = value.ratting;
        product.item.Image = value.image;
        product.item.productDetails = value.productDetails;
        product.item.saleOff = value.saleOff;
        res.send(product);
      });

});

async function run(url,crawlhtml) {
/*   const oldProxyUrl = 'p8.vietpn.co:1808';
  const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl); */
    const browser = await puppeteer.launch({
      headless: true,
      args: [
       // '--proxy-server=http=p8.vietpn.co:1808',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
    });
  
    const page = await browser.newPage();
    await page.goto(url);
  
    const result = await page.evaluate(( ) => {
      let data = {};
      
      let elements = "";
      data.msg = "100";
 
      var content = document.querySelector('#Body') !== null?document.querySelector('#Body') : "";
      data.name = content.querySelector('#itemTitle') !== null?content.querySelector('#itemTitle').textContent : "";

      data.price = content.querySelector('#orgPrc') !==null?content.querySelector('#orgPrc').innerText : "";
      data.saleOff=content.querySelector('#youSaveSTP') !==null?content.querySelector('#youSaveSTP').innerText : "";
      
      data.ratting = content.querySelector('#histogramid > div > div.ebay-content-wrapper > span.ebay-review-start-rating') !==null?content.querySelector('#histogramid > div > div.ebay-content-wrapper > span.ebay-review-start-rating').innerHTML : "";
      data.productDetails = content.querySelector('#vi-desc-maincntr') !==null?content.querySelector('#vi-desc-maincntr').innerHTML : "";
      var imagesmall = content.querySelector('#vi_main_img_fs > ul') !==null?content.querySelector('#vi_main_img_fs > ul') : "";
      var image = imagesmall.querySelectorAll('img');
      data.image=[];
      for(let i =0; i< image.length;i++){
        data.image.push(image[i].src);
      }

      return data;
    });
  
    await browser.close();
    console.log('--------------');
    return result; 
  }
  
module.exports= router;