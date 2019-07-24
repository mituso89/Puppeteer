var express = require('express');
const puppeteer = require('puppeteer');
var crawl = require('./../shared/crawlHtml.js');
var product = require('./../shared/product.js');

var router = express.Router();

const blockedResourceTypes = [
  'image','media','script','link','stylesheet',
  'font',
  'texttrack',
  'object',
  'beacon',
  'csp_report',
  'imageset',
];

const skippedResources = [ 
  'quantserve',
  'adzerk',
  'doubleclick',
  'adition',
  'exelator',
  'sharethrough',
  'cdn.api.twitter',
  'google-analytics',
  'googletagmanager',
  'google',
  'fontawesome',
  'facebook',
  'analytics',
  'optimizely',
  'clicktale',
  'mixpanel',
  'zedo',
  'clicksor',
  'tiqcdn',
  'dien'
];




router.get('/',function (req, res,next){
  var url ="";
  var crawlhtml =  crawl.costco;
  var asin ="";
  
  url ="https://www.amazon.com/dp/"
  try {
     asin= req.query.url;
    url=url+ asin;



  } catch (error) {
    console.log('---------------');
  }
  
    run(url,crawlhtml).then((value) => {

       var crawlamzon={}
       crawlamzon.name = value.name;
       crawlamzon.addon = value.addon;
       crawlamzon.ratting = value.ratting;
       crawlamzon.reviews = value.reviews;
       crawlamzon.Discriptsion = value.Discriptsion; 
       crawlamzon.shipping = value.shipping; 
       crawlamzon.ShippingWeight = value.ShippingWeight; 

        res.send(crawlamzon);
      });

});

async function run(url,crawlhtml) {
     
    const browser = await puppeteer.launch({
      headless:false,
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
    //await page.waitFor(1000);

    
    const result = await page.evaluate(( ) => {
   
      let data = {}
    let addon= document.querySelector('#sims-fbt-form > div.sims-fbt-rows > fieldset > ul > li:nth-child(1) > span > span > div > label > span > div')
    let start;
    let shipping = document.querySelector('#olp_feature_div > div > span > a')
    let information=document.querySelector('#productDetails_detailBullets_sections1 > tbody')

  
    
    if(information!=null ) {
      let tr = information.querySelectorAll('tr');
      try {
        for(let i= 0; i< tr.length;i++){
          if(tr[i].cells[0].innerText=='Shipping Weight'){
            data.ShippingWeight = tr[i].cells[1].innerText.replace('(View shipping rates and policies)','');
          }
    }
      } catch (error) {
        data.ShippingWeight="";
      }
     
      //data.tr=tr[0].cells[0].innerText;
    }
    else{
      data.ShippingWeight="";
    }


    if(shipping!=null){
        shipping = shipping.innerText;
        start = shipping.indexOf("+");
        if(start==-1){
        
          data.shipping = "0";
        }
        else{
          shipping= shipping.slice(start+1, shipping.length)
          shipping = shipping.replace("$","");
          shipping = shipping.replace(" shipping","");
        
          data.shipping = shipping;
        }
     
    }
    else{
      data.shipping ="0"
    }
    if(addon !=null)
    {
        data.addon =addon.querySelector('#sims-fbt-form > div.sims-fbt-rows > fieldset > ul > li:nth-child(1) > span > span > div > label > span > div > i') !== null?addon.querySelector('#sims-fbt-form > div.sims-fbt-rows > fieldset > ul > li:nth-child(1) > span > span > div > label > span > div > i').innerText: "";
    }
    else{
      data.addon ="";
    }
     data.name = document.querySelector('#reviewSummary > div.a-row.a-spacing-small > span > a > span') !== null?document.querySelector('#reviewSummary > div.a-row.a-spacing-small > span > a > span').innerText : "";
    
      var ratting5 =  document.querySelector('#histogramTable > tbody > tr:nth-child(1) > td.a-text-right.aok-nowrap > a') !== null?document.querySelector('#histogramTable > tbody > tr:nth-child(1) > td.a-text-right.aok-nowrap > a').textContent.replace('%',''):"0";
    
     var ratting4= document.querySelector('#histogramTable > tbody > tr:nth-child(2) > td.a-text-right.aok-nowrap > a') !== null?document.querySelector('#histogramTable > tbody > tr:nth-child(2) > td.a-text-right.aok-nowrap > a').textContent.replace('%',''):"0";
     var ratting3 = document.querySelector('#histogramTable > tbody > tr:nth-child(3) > td.a-text-right.aok-nowrap > a') !== null?document.querySelector('#histogramTable > tbody > tr:nth-child(3) > td.a-text-right.aok-nowrap > a').textContent.replace('%',''):"0";
    
     var ratting2 = document.querySelector('#histogramTable > tbody > tr:nth-child(4) > td.a-text-right.aok-nowrap > a') !== null?document.querySelector('#histogramTable > tbody > tr:nth-child(4) > td.a-text-right.aok-nowrap > a').textContent.replace('%',''):"0";
     var ratting1 = document.querySelector('#histogramTable > tbody > tr:nth-child(5) > td.a-text-right.aok-nowrap > a') !== null?document.querySelector('#histogramTable > tbody > tr:nth-child(5) > td.a-text-right.aok-nowrap > a').textContent.replace('%',''):"0";
    data.ratting=[];
     data.ratting.push(ratting1);
     data.ratting.push(ratting2);
     data.ratting.push(ratting3);
     data.ratting.push(ratting4);
     data.ratting.push(ratting5);
    
     data.Discriptsion =document.querySelector('#aplus') !== null?document.querySelector('#aplus').innerHTML:"";
     data.reviews = document.querySelector('#dp-summary-see-all-reviews') !== null?document.querySelector('#dp-summary-see-all-reviews').innerText:"";

      return data;
      
    });

    await browser.close();

   
    return result;
  }





  
  
module.exports= router;
