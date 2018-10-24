
var express = require('express');
const puppeteer = require('puppeteer');
var crawl = require('./../shared/crawlHtml.js');
var product = require('./../shared/product.js');

var router = express.Router();


router.get('/',function (req, res,next){
  var url ="";
  var crawlhtml =  crawl.costco;
  try {
    url= req.query.url;

  } catch (error) {
    console.log('---------------');
  }
  
    run(url,crawlhtml).then((value) => {

       
        product.item.Image = value.lis;
        product.item.ratting = value.ratting;

        product.item.reviewcount = value.reviewcount;

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
    let imageLarge=[];
    const page = await browser.newPage();
   
    await page.goto(url);
    //await page.waitFor('#theViews > div > div');
    await page.waitFor(5000)

    const result = await page.evaluate(( ) => {
      let data = {};
      
     
      data.msg = "100";

      var content = document.querySelector('#product-page') !== null?document.querySelector('#product-page') : "";
      if (content!=""){
        data.reviewcount=content.querySelector('#BVRRSummaryContainer > div > div > div > div > div > div > dl > a > dd > a > span > span') !==null?content.querySelector('#BVRRSummaryContainer > div > div > div > div > div > div > dl > a > dd > a > span > span').innerText : "0";
        data.ratting = content.querySelector('#BVRRSummaryContainer > div > div > div > div > div > div > dl > dd.bv-rating-ratio-number > div > a > span') !==null?content.querySelector('#BVRRSummaryContainer > div > div > div > div > div > div > dl > dd.bv-rating-ratio-number > div > a > span').innerText : "";


        var imagesmall = content.querySelector('#thumbnails > div') !==null?content.querySelector('#thumbnails > div') : "";
        var image = imagesmall.querySelectorAll('img');
        //data.image1 = html;
        data.image=[];
        for(let i =0; i< image.length;i++){
          data.image.push(image[i].src);
        }
        if(document.querySelector('#theViews > div > div')!=null){
          data.imagecount = document.querySelector('#theViews > div > div').querySelectorAll('a').length;
        }
        else{
          data.imagecount =0;
          data.imagesingle = document.querySelector("#productImageContainer")!==null?document.querySelector("#productImageContainer").querySelectorAll('img')[2].src : ""
        }
     
        return data;
        
      }
  
      
      return data;
    });
  
    
  if(result.imagecount==0){
    imageLarge.push(result.imagesingle);
  }

  for(let i=0; i<result.imagecount;i++)
  {

    let click= "#theViews > div > div > a:nth-child({count})";
    click = click.replace("{count}",i+1)
    await page.click(click)
    const resultimage = await page.evaluate(( ) => {

      let lis = document.querySelector("#productImageContainer")!==null?document.querySelector("#productImageContainer").querySelectorAll('img')[2].src : "";

      return lis;
    });
    imageLarge.push(resultimage)
  }
 
    await browser.close();
   result.lis =imageLarge;
    return result;
  }
  
module.exports= router;