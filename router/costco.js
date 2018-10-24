var express = require('express');
const puppeteer = require('puppeteer');
var crawl = require('./../shared/crawlHtml.js');
var product = require('./../shared/product.js');

var router = express.Router();
const blockedResourceTypes = [
  'image','media','link','stylesheet',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
];


router.get('/',function (req, res,next){
  var url ="";
  var crawlhtml =  crawl.costco;
  try {
    url= req.query.url;

  } catch (error) {
    console.log('---------------');
  }
  
    run(url,crawlhtml).then((value) => {

        product.item.price = value.price;
        product.item.name = value.name;
        product.item.ratting = value.ratting;
        product.item.features = value.features;
       
        product.item.productDetails = value.productDetails;
        product.item.productSpecifications = value.productSpecifications;
        product.item.saleOff = value.saleOff;
        product.item.code = value.code;
  
        //product.item.image1 =value;
        product.item.saleOff = value.saleOff;
        res.send(product);
      });

});
function imagesHaveLoaded() {
  return Array.from(document.images).every((i) => i.complete);
}
async function run(url,crawlhtml) {

    const browser = await puppeteer.launch({
      headless: false,
      args: [
        
      
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ],
    });
  
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    
    page.on('request', request => {
      if (
        blockedResourceTypes.indexOf(request.resourceType()) !== -1 
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    await page.goto(url);
    await page.waitFor(1000);
    
    const result = await page.evaluate(( ) => {
      let data = {};
      
      let elements = "";
      data.msg = "100";

      var content = document.querySelector('#product-page') !== null?document.querySelector('#product-page') : "";
      if (content!=""){
        data.name = document.querySelector('#product-page > div.row.top-content > div.col-xs-12.hidden-xl > div.product-h1-container.visible-xs-block.visible-sm-block.visible-md-block.visible-lg-block > h1') !== null?document.querySelector('#product-page > div.row.top-content > div.col-xs-12.hidden-xl > div.product-h1-container.visible-xs-block.visible-sm-block.visible-md-block.visible-lg-block > h1').textContent : "";
        data.code =  content.querySelector('#product-body-item-number > span') !==null?content.querySelector('#product-body-item-number > span').innerText : "";
        data.price = content.querySelector('#math-table > div.your-price.row.no-gutter > div > span.value') !==null?content.querySelector('#math-table > div.your-price.row.no-gutter > div > span.value').innerText : "";
        data.saleOff=content.querySelector('#breakdown > div.disc.active > span.disc-value') !==null?content.querySelector('#breakdown > div.disc.active > span.disc-value').innerText : "";
        
        data.ratting = content.querySelector('#BVRRSummaryContainer > div > div > div > div > div > div > dl > dd.bv-rating-ratio-number > div > a > span') !==null?content.querySelector('#BVRRSummaryContainer > div > div > div > div > div > div > dl > dd.bv-rating-ratio-number > div > a > span').innerText : "";
        data.features = content.querySelector('#product-details > div.features-container.form-group') !==null?content.querySelector('#product-details > div.features-container.form-group').innerHTML : "";
        data.productSpecifications = content.querySelector('#pdp-accordion-collapse-2 > div') !==null?content.querySelector('#pdp-accordion-collapse-2 > div').innerHTML : "";
        
        data.productDetails = content.querySelector('#pdp-accordion-collapse-1 > div') !==null?content.querySelector('#pdp-accordion-collapse-1 > div').innerHTML: "";
       
        
      }
    
      
      //data.content = content
      
      return data;
    });

    await browser.close();

   
    return result;
  }





  
  
module.exports= router;