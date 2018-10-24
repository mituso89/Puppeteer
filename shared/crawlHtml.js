var productcrawlhtml={
    costco:{
        name : '#product-details > div.row.visible-xl > div > div.product-h1-container.visible-xl-block > h1',
        code :'',
        price:'#math-table > div.your-price.row.no-gutter > div > span.value',
        content :'',
        ratting :'#BVRRSummaryContainer > div > div > div > div > div > div > dl > dd.bv-rating-ratio-number > div > a > span',
        features :'#product-details > div.features-container.form-group > ul',
        productDetails:'#pdp-accordion-collapse-1 > div > div.product-info-description',
        productReviews:'#BVRRContainer > div > div > div > div > div.bv-header > div.bv-section-summary',
        productSpecifications:'#pdp-accordion-collapse-2 > div',
        saleOff:'',
        fromDate:'',
        toDate:'',
        Image: [],url:''
    },
    ebay :{
        name : '#itemTitle',
        code :'',
        price:'#orgPrc',
        content :'',
        ratting :'#histogramid > div > div.ebay-content-wrapper > span.ebay-review-start-rating',
        features :'',
        productDetails:'#vi-desc-maincntr',
        productReviews:'',
        productSpecifications:'#viTabs_0_is > div',
        saleOff:'',
        fromDate:'',
        toDate:'',
        Image: '#vi_main_img_fs_slider',url:''
    }
};

module.exports = productcrawlhtml;