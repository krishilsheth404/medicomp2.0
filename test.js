// app using yahoo.com as a search engine
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware 
const axios = require('axios');
const path = require('path');
const cheerio = require('cheerio')
// const puppeteer = require('puppeteer');
const request = require('request');
const fs = require('fs');
const ejs = require("ejs");
// const { AddressContext } = require('twilio/lib/rest/api/v2010/account/address');
const { getElementsByTagType } = require('domutils');
const { off } = require('process');
// var urlForSwiggy, urlForZomato;
// var extractLinksOfSwiggy, extractLinksOfZomato, matchedDishes = {};
// var matchedDishesForSwiggy, matchedDishesForZomato, tempAddress, discCodesForZomato, addr, linkOld = '';
// var z, s, w;
// var sdfd, tempurl, tempurl2;
// var Offers = 0;
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

// app.set('views', './');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// var newItem;
// Route to Login Page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});


app.post('/details', async(req, res) => {
    // Insert Login Code Here

    const final = []
    const l=(req.body.foodItem).split(' ');
       var urlForPe = `https://pharmeasy.in/search/all?name=${req.body.foodItem}`;
       var  urlForAp = `https://www.apollopharmacy.in/search-medicines/${req.body.foodItem}`;

        extractMedNamesFromApollo= async (url) => {
            try {
                // Fetching HTML
                const { data } = await axios.get(url)
    
                // Using cheerio to extract <a> tags
                const $ = cheerio.load(data);
                var temp;
                // BreadCrumb_peBreadCrumb__2CyhJ
                $('.ProductCard_productName__f82e9').map((i, elm) => {
                    if ($(elm).text().includes('Apollo')) {
    
                    } else {
                        final.push({
                            name:$(elm).text(),
                        })
                    }
                })
                final.sort();
                final.push(req.body.foodItem);
                // console.log(final)
    
            } catch (error) {
                // res.sendFile(__dirname + '/try.html');
                // res.sendFile(__dirname + '/error.html');
                // console.log(error);
    
                // console.log(error);
                return {};
            }
        };
         extractMedNamesFromPharmeasy = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)
            const $ = cheerio.load(data);
            // console.log(data)
      console.log(final);            
            $('.ProductCard_medicineName__8Ydfq').map((i, elm) => {
                    final.push({
                        name:$(elm).text(),
                    })
                });
                    
                  
                    
            
                    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            final.push({
                name:"No Products Found",
            });
         
         
        }
        };

        await Promise.all([ extractMedNamesFromApollo(urlForAp),extractMedNamesFromPharmeasy(urlForPe)])

        // final.sort();
        final.push(req.body.pin);
        final.push(req.body.foodItem);
        console.log(final)
        
    res.render(__dirname+'/medDetails', { final: final });
});

app.post('/products', async(req, res) => {
    // Insert Login Code Here

    const final = []
    console.log(req.body.foodItem)
    urlForPe = `https://www.pulseplus.in/products/${req.body.foodItem}`;
    extractdoe = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            var count=0;
            // BreadCrumb_peBreadCrumb__2CyhJ
            try{

                $('.col-sm-4 a').map((i, elm) => {
                    // if(count<100){
                    
                    final.push({
                        name:$(elm).text(),
                        link:'https://www.pulseplus.in'+$(elm).attr('href')});
                    count++;
                    // }
                })

            }catch(e){
                console.log(e);
            }
            // final.sort();
            // final.push(req.body.pin);
            // final.push(req.body.foodItem);
            // console.log(final)

        } catch (error) {
            return {};
        }
    };
    await extractdoe(urlForPe);
    res.render(__dirname+'/charMedSearch', { final: final });
});

app.post('/description', async(req, res) => {
    // Insert Login Code Here

    const final = []
    console.log(req.body.foodItem)
    url=req.body.foodLink;


    extractDescFromApollo = async(url) => {
        try {
            // Fetching HTML

            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html())
            
            
            
            const z=[]//detailed description
            const x=[];
            const descr=[];
            $('.ProductDetailsGeneric_descListing__w3wG3 h2').map((i, elm) => {
                z.push($(elm).text());
               })

               $('.ProductDetailsGeneric_descListing__w3wG3 div').map((i, elm) => {
                               x.push($(elm).text());
                              //  console.log('https://www.pulseplus.in'+$(elm).attr('href'));                        
                            })
               
                    for(var i=0;i<x.length;i++){
                        descr.push({'data':z[i],
                                    'res':x[i]
                                });
                    }

            console.log(descr)
         const y=[];
         var temp,temp2;
         $('.PdpFaq_panelRoot__3xR9g').map((i, elm) => {
            temp=$(elm).text().split('?')[0];
            temp2=$(elm).text().split('?')[1];
             y.push({
                heading:temp,
                data:temp2});
       });
          
           final.push({
            desc:descr,
            faq:y,
        });










        const NameOfSubs=[];
        const PriceOfSubs=[];
        const ImgLinkOfSubs=[];
        // Using cheerio to extract <a> tags
       
        const subs=[];

        
        $('.ProductSubstituteWidget_productTitle__3-F3o').each(function(i, elm) {
            NameOfSubs.push($(elm).text()) // for name 
        });
        console.log(NameOfSubs[1])
        $('.ProductSubstituteWidget_priceGroup__bX52h').each(function(i, elm) {
            PriceOfSubs.push($(elm).text()) // for price 
        });
        $('.ProductSubstituteWidget_productIcon__BIGXr img').each(function(i, elm) {
            ImgLinkOfSubs.push($(elm).attr('srcset')) // for imgLink 
        });

        if(NameOfSubs.length==0)
        {
            console.log('method 2');
            $('.CommonWidget_productTitle__lhhlP').each(function(i, elm) {
                NameOfSubs.push($(elm).text()) // for name 
            });
            $('.CommonWidget_priceGroup__21BGB').each(function(i, elm) {
                PriceOfSubs.push($(elm).text()) // for price 
            });
            $('.CommonWidget_productIcon__3GJCc img').each(function(i, elm) {
                ImgLinkOfSubs.push($(elm).attr('srcset')) // for imgLink 
            });
        }
        if(NameOfSubs.length==0){
            console.log('method 3');
            $('.ProductSubstituteWidget_productTitle__iOhB3').each(function(i, elm) {
                NameOfSubs.push($(elm).text()) // for name 
            });
            $('.ProductSubstituteWidget_priceGroup__hbGkO').each(function(i, elm) {
                PriceOfSubs.push($(elm).text()) // for price 
            });
            $('.ProductSubstituteWidget_productIcon__yKqBO img').each(function(i, elm) {
                ImgLinkOfSubs.push($(elm).attr('data-srcset')) // for imgLink 
            });
          }
          if(NameOfSubs.length==0){
            console.log('method 4');
            $('.CommonWidget_productTitle__4pL5y').each(function(i, elm) {
                NameOfSubs.push($(elm).text()) // for name 
            });
            $('.CommonWidget_priceGroup__v1Wyg').each(function(i, elm) {
                PriceOfSubs.push($(elm).text()) // for price 
            });
            $('.CommonWidget_productIcon__f_V39 img').each(function(i, elm) {
                ImgLinkOfSubs.push($(elm).attr('data-srcset')) // for imgLink 
            });
          }
        
        
        console.log('PRODUCT SUBSTITUTES-.\n');
        for(var i=0;i<NameOfSubs.length;i++){

                final.push({
                    subsname:NameOfSubs[i],
                    subsprice:PriceOfSubs[i],
                    subsImgLink:ImgLinkOfSubs[i],
                })
        // console.log(final);
       }

            console.log(final)

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);

            // console.log(error);
            return {};
        }
    };



    urlForYtVideo = `https://in.video.search.yahoo.com/search?p=${req.body.foodItem}+medicine+site:youtube.com&fr=sfp`;

    extractdoe = async(url) => {
        try {
            // Fetching HTML
            const { data } = await axios.get(url)

            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            var temp;
            const vname=[],vlink=[],vimglink=[];
            $('.v-meta h3').each(function(i, elm) {
                vname.push($(elm).text()) // for name 
            });
            $('.results li a').each(function(i, elm) {
                vlink.push($(elm).attr('data-rurl')) // for name 
            });
            $('.fill img').each(function(i, elm) {
                vimglink.push($(elm).attr('src')) // for name 
            });
            // BreadCrumb_peBreadCrumb__2CyhJ
            console.log(vname)
            try{
                for(var i=0;i<3;i++){

                    final.push({
                        videoname:vname[i],
                        videolink:vlink[i],
                        videoImgLink:vimglink[i],
                    });
                }
                    
                
            }catch(e){
                console.log(e);
            }
           final.push({nameOfMed:req.body.foodItem});
            // console.log(final)

        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);

            console.log(error);
            return {};
        }
    };

    await extractDescFromApollo(url);
    await extractdoe(urlForYtVideo);
    console.log(final)
  
    res.render(__dirname+'/medDescription', { final: final });
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/name.html');
// });

// extractLinkFromGoogle = async(url) => {
//     try {
//         // Fetching HTML
//         const { data } = await axios.get(url)

//         // Using cheerio to extract <a> tags
//         const $ = cheerio.load(data);


//         rawUrl = $('.kCrYT>a').first().attr('href');
//         url = rawUrl.split("/url?q=")[1].split("&")[0];
//         console.log('Extracting url: ', url);

//         return url;

//     } catch (error) {
//         // res.sendFile(__dirname + '/try.html');
//         // res.sendFile(__dirname + '/error.html');
//         console.log(error);
//         return 0;
//     }
// };

extractLinkFromyahoo = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)
        // console.log(typeof(data));
        // console.log(data)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());

        const rawUrl = $('li .compTitle h3 a').first().attr('href');
        console.log(rawUrl);
        if (rawUrl != undefined) {
            return rawUrl
        } else {
            return '';
        }
        // url = rawUrl.split("/url?q=")[1].split("&")[0];
        // console.log('Extracting url: ', url);


    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return 0;
    }
};



getOffersOfPharmeasy=async()=>{

    const { data } = await axios.get(`https://pharmeasy.in/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    var count=0;
    $('.OffersCard_title__1CZHB').map((i, elm) => {
        if(count<2){
            offers.push($(elm).text());
            count++;
        }
     });
    return offers;
}
extractDataOfPharmEasy = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
       
        

        const offers=await getOffersOfPharmeasy();
           
        // console.log(offers)
        // console.log($.html());
        var temp;
        // BreadCrumb_peBreadCrumb__2CyhJ
        

        $('.BreadCrumbLink_breadCrumb__LljfJ').map((i, elm) => {
            temp = $(elm).text();
        })
        if(temp==undefined||temp==''){
            $('.BreadCrumbLink_breadCrumb__R6DrR').map((i, elm) => {
                temp = $(elm).text();
            })
        }
        var price = $('.PriceInfo_ourPrice__P1VR1').text();
        if (price == '') {
            price = $('.ProductPriceContainer_mrp__pX-2Q').text();
        }
        if (price == '') {
            price = $('.ProductPriceContainer_mrp__mDowM').text();
        }
      

        if (price != '') {
            if (price.includes('*')) {
                price = price.split('*')[0];
            }
            if (price.includes('???')) {
                price = price.split('???')[1];
            }
        }


        return {
            name: 'PharmEasy',
            item: temp,
            link: url,
            imgLink: $('.swiper-wrapper img[alt=img]').first().attr('src'),
            price: price,
            offer:offers,
        };
    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);

        console.log(error);
        return {};
    }
};

getOffersOfNetmeds=async()=>{
    const { data } = await axios.get(`https://netmeds.com/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.offer-coupon').map((i, elm) => {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfNetMeds = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url);

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        const offers=await getOffersOfNetmeds();


        return {
            name: 'NetMeds',
            item: $('.product-detail').text(),
            link: url,
            imgLink: $('.largeimage img').attr('src'),
            price: $('#last_price').attr('value'),
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};


getOffersOfApollo=async()=>{
    const { data } = await axios.get(`https://www.apollopharmacy.in/special-offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.OffersCard_title__1U6VE').map((i, elm) => {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfApollo = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data,{xmlMode: false});
        const apolloData=JSON.parse($('#__NEXT_DATA__').text());
        console.log(url);
        var t, m;
        const offers=await getOffersOfApollo();

      

      m=apolloData.props.pageProps.productDetails.productdp[0].special_price;
        if(!m){
            m=apolloData.props.pageProps.productDetails.productdp[0].price;
        }

        return {
            name: 'Apollo',
            item: apolloData.props.pageProps.productDetails.productdp[0].name,
            link: url,
            imgLink: 'https://newassets.apollo247.com/pub/media'+apolloData.props.pageProps.productDetails.productdp[0].image,
            price: m,
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};


extractDataOfHealthmug = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data,{xmlParse:false});
        // console.log($.html());
        var healthMugData;
        $("script[type=application/ld+json]").map(function(i,v){
              if(i==1){
                healthMugData=JSON.parse($(this).text());
              }
        });


        return {
            name: 'Healthmug',
            item: healthMugData.name,
            link: url,
            imgLink:healthMugData.image,
            price: healthMugData.offers.price,
            offer:'',
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};
extractDataOf3Meds = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        const offers=[];
        $('.AdditionalOffers ul li').map((i, elm) => {
            offers.push($(elm).text());
         });
         var p=$('.actualrate').text().trim();
         p=p.split('Rs.')[1];

        return {
            name: '3 Meds',
            item: $('h1').text(),
            link: url,
            imgLink: $('.productimg img').first().attr('src'),
            price:p,
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};


extractDataOfTata = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url);

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        var t, m;
        // console.log($.html());

        if ($('.container-fluid-padded h1').text()) {
            t = $('.container-fluid-padded h1').text();

        } else if ($('.style__pro-title___3G3rr').first().text()) {

            t = $('.style__pro-title___3G3rr').first().text();
        } else if ($('.style__pro-title___3zxNC').first().text()) {
            t = $('.style__pro-title___3zxNC').first().text();
        } else if ($('.style__pro-title___2QwJy').first().text()) {
            t = $('.style__pro-title___2QwJy').first().text();
        } else if ($('.PriceWidget__selectedContainer__cCRai .marginTop-8').first().text()) {
            t = $('.PriceWidget__selectedContainer__cCRai .marginTop-8').first().text();
        } else {
            t = $('h1[class=col-6]').first().text()
        }
        // t = $('.style__pro-title___3G3rr').first().text();


        if ($('.Price__price__22Jxo').text()) {

            m = $('.Price__price__22Jxo').text();

        } else if ($('.style__price-tag___B2csA').first().text()) {

            m = $('.style__price-tag___B2csA').first().text();

        } else if ($('.style__product-pricing___1OxnE').first().text()) {

            m = $('.style__product-pricing___1OxnE').first().text();

        } else if ($('.style__price-tag___cOxYc').first().text()) {
            m = $('.style__price-tag___cOxYc').first().text();
        } else {
            m = $('.l3Regular').first().text();
        }

        console.log(m, "===", t)
        if (m != '') {
            console.log(m);
            if (m.includes('off')) {


                if (m.includes("MRP")) {
                    m = m.split("MRP")[0];
                }
                if (m.includes('???')) {
                    m = m.split("???")[1];
                }
            } else if (m.includes('MRP')) {
                m = m.split("MRP")[1].trim();
                if (m.includes('???')) {
                    m = m.split('???')[1];
                }
            } else {
                m = m;
            }
        }
        console.log(m, "===", t)
        if (t == "" && m == "") {
            t = "Not Available";
            m = "Not Available";
        }

        return {
            name: 'Tata 1mg',
            item: t,
            link: url,
            price: m,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};



getNameOfPulsePlus=async(url)=>{
    const { data } = await axios.get(url)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    var temp;
    // BreadCrumb_peBreadCrumb__2CyhJ

        $('.col-sm-4 a').map((i, elm) => {
           temp="https://www.pulseplus.in/products"+$(elm).text();
        })
        return temp;
}
extractDataOfmedplusMart = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
                const offers=[];
                $('.mb-1 label').each(function(i, elm) {
                    offers.push($(elm).text());
                })


        var t = $('span[property=price]').attr('content');

        return {
            name: 'PulsePlus',
            item: $('#divProductTitle>h1').text(),
            link: url,
            imgLink: $('.profile-picture').attr('src'),
            // price: $('.DrugPriceBox__price___dj2lv').text(),
            // price: $('span[property=priceCurrency]').text()
            price: t,
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};

getOffersOfMyUpChar=async()=>{
    const { data } = await axios.get(`https://www.myupchar.com/en/offers`)

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(data);
    const offers=[];
    $('.offers-bx h2').each(function(i, elm) {
        offers.push($(elm).text());
     });
    return offers;
}
extractDataOfMyUpChar = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);

        const offers=await getOffersOfMyUpChar();
        
        // console.log($.html());
        var a = $('.head h1').first().text();
        if(!a){
            a=$('#med_details h1').first().text();
        }
        // console.log(a);
        var b = $('.price_txt .txt_big').first().text();
        if(!b){
            b=$('.pack_sp').first().text();
        }
        if(!b){
            b=$('.pack_mrp').first().text();
        }
        // console.log(b);
        if (b != '') {
            if (b.includes('???')) {
                b = b.split('???')[1];
            }
        }
        return {
            name: 'myupchar',
            item: a,
            link: url,
            imgLink: $('.image_slide').attr('src'),
            price: b,
            offer:offers,
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        console.log(error);
        return {};
    }
};


extractDataOfOBP = async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        // console.log($.html());
        var p=$('.price').first().text();
        if(p){
            if(p.includes(" ??? "))
            {
                console.log(p)
                p=p.split(" ??? ")[0];
                console.log(p)
            }
        }
        if(p){
            if(p.includes('???')){
                p=p.split('???')[1];
            }
        }

        return {
            name: 'Tablet Shablet',
            item: $('.entry-title').text(),
            link: url,
            imgLink: $('.jws-gallery-image img').attr('src'),
            price: p,
            offer:[],
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};

extractDataOfPP= async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
        var dataOfPP={};
        $("script[type=application/ld+json]").map(function(i,v){
            dataOfPP=JSON.parse($(this).text());
    });
        // console.log($.html());

        return {
            name: 'Pasumai Pharmacy',
            item:dataOfPP.name,
            link: url,
            imgLink: dataOfPP.image,
            price: dataOfPP.offers.price,
            offer:'',
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};



extractDataOfEgmedi= async (url) => {
    try {
        // Fetching HTML
        const { data } = await axios.get(url)

        // Using cheerio to extract <a> tags
        const $ = cheerio.load(data);
       
        // console.log($.html());

        return {
            name: 'Egmedi',
            item:$('.product h2').first().text(),
            link: $('.product a').first().attr('href'),
            imgLink: $('.product img').first().attr('src'),
            price: $('.product .price').first().text(),
            offer:'',
        };

    } catch (error) {
        // res.sendFile(__dirname + '/try.html');
        // res.sendFile(__dirname + '/error.html');
        // console.log(error);
        return {};
    }
};






app.post('/result', async(req, res) => {
    // Insert Login Code Here

    const nameOfMed = req.body.foodItem + '\n';
    console.log(req.body.foodItem);
    // console.log('Name')
    // try {
    //     let date_ob = new Date();

    //     // current date
    //     // adjust 0 before single digit date
    //     const date = ("0" + date_ob.getDate()).slice(-2);

    //     // current month
    //     const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    //     // current year
    //     const year = date_ob.getFullYear();
    //     const finalDate = date + '/' + month + '/' + year;

    //     const auth = new google.auth.GoogleAuth({
    //         keyFile: "medicompJson.json",
    //         scopes: "https://www.googleapis.com/auth/spreadsheets",
    //     })
    //     const spreadsheetId = "18AFfkHKArlpCqDuBC6yzfXOkTgOzRGmXeq88uhqQqGo";
    //     const client = await auth.getClient();
    //     const googleSheets = google.sheets({ version: "v4", auth: client });

    //     googleSheets.spreadsheets.values.append({
    //             auth,
    //             spreadsheetId,
    //             range: "Sheet1!A:B",
    //             valueInputOption: "USER_ENTERED",
    //             resource: {
    //                 values: [
    //                     [finalDate, nameOfMed]
    //                 ]
    //             },
    //         })
    //         // console.log(metadata);
    // } catch (error) {
    //     console.log({});
    // }



    // fs.appendFile("data.txt", nameOfMed, function(err) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     console.log("The file was saved!");
    // });
    // https://www.ask.com/web?q=site:apollopharmacy.in%20crocin%20advance&ad=dirN&o=0
    const urlForPharmEasy = `https://in.search.yahoo.com/search;_ylt=?p=site:pharmeasy.in+${nameOfMed}&ad=dirN&o=0`;
    const urlForNetMeds = `https://in.search.yahoo.com/search;_ylt=?p=site:netmeds.com+${nameOfMed}&ad=dirN&o=0`;
    const urlForApollo = `https://in.search.yahoo.com/search;_ylt=?p=site:apollopharmacy.in+${nameOfMed}&ad=dirN&o=0`;
    // const urlForHealthmug = `https://www.healthmug.com/search?keywords=${nameOfMed}`;
    const urlForTata = `https://in.search.yahoo.com/search;_ylt=?p=site:1mg.com+${nameOfMed}&ad=dirN&o=0`;
    const urlForOBP = `https://in.search.yahoo.com/search;_ylt=?p=site:tabletshablet.com+${nameOfMed}&ad=dirN&o=0`;
    const urlFormedplusMart = `https://in.search.yahoo.com/search;_ylt=?p=site:pulseplus.in+${nameOfMed}&ad=dirN&o=0`;
    const urlForMyUpChar = `https://in.search.yahoo.com/search;_ylt=?p=site:myupchar.com+${nameOfMed}&ad=dirN&o=0`;
    const urlFor3Meds = `https://in.search.yahoo.com/search;_ylt=?p=site:3meds.com+${nameOfMed}&ad=dirN&o=0`
    const urlForHealthmug = `https://in.search.yahoo.com/search;_ylt=?p=site:healthmug.com+${nameOfMed}&ad=dirN&o=0`;
    const urlForPP = `https://in.search.yahoo.com/search;_ylt=?p=site:pasumaipharmacy.com+${nameOfMed}&ad=dirN&o=0`;
   
    const item = [],
        final = [];
    // getLinks = async() => {
    //     for (const item of items) {
    //         // await fetchItem(item)
    //         // if (t != '') {
    //         if (item.includes('netmeds')) {
    //             final.push(
    //                     await extractLinkFromyahoo(item)
    //                 ) // final.push(await extractDataOfNetMeds(t));
    //         } else if (item.includes('1mg')) {

    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )


    //             // final.push(await extractDataOfTata(t));
    //         } else if (item.includes('myupchar')) {
    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )

    //             console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('pharmeasy')) {
    //             // console.log('yes in it');
    //             final.push(

    //                 await extractLinkFromyahoo(item)
    //             )
 
    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('pulseplus')) {
    //             // console.log('yes in it');
    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         } else if (item.includes('tabletshablet')) {
    //             // console.log('yes in it');
    //             final.push(
    //                 await extractLinkFromyahoo(item)
    //             )

    //             // console.log(urlForMyUpChar);

    //             // final.push(await extractDataOfmedplusMart(t));
    //         }

    //         // if(a!=1){
    //         //     final.push(extractLinkFromGoogle('https://www.google.com/search?q=site:pharmeasy/com'))
    //         // }
    //         // } // linkNames.push(t);
    //     }
    // }
    // await getLinks();
    // console.log(final);
    extractSubsfApollo = async (url,final) => {
        try {
            // Fetching HTML
            url=url.split('?')[0];
            // url="https://apollopharmacy.in"+url;
            console.log('got it->'+url);
            const { data } = await axios.get(url)
            const NameOfSubs=[];
            const PriceOfSubs=[];
            const ImgLinkOfSubs=[];
            // Using cheerio to extract <a> tags
            const $ = cheerio.load(data);
            // console.log($.html());
            const subs=[];

           
        $('.ProductSubstituteWidget_productTitle__3-F3o').each(function(i, elm) {
            NameOfSubs.push($(elm).text()) // for name 
        });
        console.log(NameOfSubs[1])
        $('.ProductSubstituteWidget_priceGroup__bX52h').each(function(i, elm) {
            PriceOfSubs.push($(elm).text()) // for price 
        });
        $('.ProductSubstituteWidget_productIcon__BIGXr img').each(function(i, elm) {
            ImgLinkOfSubs.push($(elm).attr('srcset')) // for imgLink 
        });

        if(NameOfSubs.length==0)
        {
            console.log('method 2');
            $('.CommonWidget_productTitle__lhhlP').each(function(i, elm) {
                NameOfSubs.push($(elm).text()) // for name 
            });
            $('.CommonWidget_priceGroup__21BGB').each(function(i, elm) {
                PriceOfSubs.push($(elm).text()) // for price 
            });
            $('.CommonWidget_productIcon__3GJCc img').each(function(i, elm) {
                ImgLinkOfSubs.push($(elm).attr('srcset')) // for imgLink 
            });
        }
        if(NameOfSubs.length==0){
            console.log('method 3');
            $('.ProductSubstituteWidget_productTitle__iOhB3').each(function(i, elm) {
                NameOfSubs.push($(elm).text()) // for name 
            });
            $('.ProductSubstituteWidget_priceGroup__hbGkO').each(function(i, elm) {
                PriceOfSubs.push($(elm).text()) // for price 
            });
            $('.ProductSubstituteWidget_productIcon__yKqBO img').each(function(i, elm) {
                ImgLinkOfSubs.push($(elm).attr('data-srcset')) // for imgLink 
            });
          }
          if(NameOfSubs.length==0){
            console.log('method 4');
            $('.CommonWidget_productTitle__4pL5y').each(function(i, elm) {
                NameOfSubs.push($(elm).text()) // for name 
            });
            $('.CommonWidget_priceGroup__v1Wyg').each(function(i, elm) {
                PriceOfSubs.push($(elm).text()) // for price 
            });
            $('.CommonWidget_productIcon__f_V39 img').each(function(i, elm) {
                ImgLinkOfSubs.push($(elm).attr('data-srcset')) // for imgLink 
            });
          }
        

            console.log('PRODUCT SUBSTITUTES-.\n');
            for(var i=0;i<5;i++){

                    final.push({
                        subsname:NameOfSubs[i],
                        subsprice:PriceOfSubs[i],
                        subsImgLink:ImgLinkOfSubs[i],
                    })
            // console.log(final);
           }
           final.push(url)
    
         
    
        } catch (error) {
            // res.sendFile(__dirname + '/try.html');
            // res.sendFile(__dirname + '/error.html');
            // console.log(error);
            return error;
        }
    };


    // const item = [];
    // item.push(
    //     await extractLinkFromyahoo(urlForPharmEasy),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForNetMeds),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForTata),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForMyUpChar),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlForOBP),
    // )
    // item.push(
    //     await extractLinkFromyahoo(urlFormedplusMart),
    // )
    await Promise.all([extractLinkFromyahoo(urlForNetMeds), extractLinkFromyahoo(urlForPharmEasy),extractLinkFromyahoo(urlForOBP),
        extractLinkFromyahoo(urlFormedplusMart),extractLinkFromyahoo(urlForMyUpChar),extractLinkFromyahoo(urlForHealthmug),
        extractLinkFromyahoo(urlFor3Meds),extractLinkFromyahoo(urlForPP),extractLinkFromyahoo(urlForApollo)])
        .then(await axios.spread(async (...responses) => {
            // console.log(...responses);

            item.push(responses[0])
            item.push(responses[1])
            item.push(responses[2])
            item.push(responses[3])
            item.push(responses[4])
            item.push(responses[5])
            item.push(responses[6])
            item.push(responses[7])
            item.push(responses[8])

            console.log(item);
            await Promise.all([extractDataOfNetMeds(item[0]), extractDataOfPharmEasy(item[1]),extractDataOfOBP(item[2]), 
            extractDataOfmedplusMart(req.body.foodLink?req.body.foodLink:item[3]), extractDataOfMyUpChar(item[4]),
            extractDataOfHealthmug(item[5]),extractDataOf3Meds(item[6]),extractDataOfPP(item[7]),
            extractDataOfApollo(item[8]),extractDataOfEgmedi(`https://egmedi.com/shop/page/1/?s=${nameOfMed}`)])
                .then(await axios.spread(async (...responses) => {
                    // console.log(...responses);
        
                    final.push(responses[0])
                    final.push(responses[1])
                    final.push(responses[2])
                    final.push(responses[3])
                    final.push(responses[4])
                    final.push(responses[5])
                    final.push(responses[6])
                    final.push(responses[7])
                    final.push(responses[8])
                    final.push(responses[9])
                    await extractSubsfApollo(item[8],final);
        
                }))
                final.sort((a, b) => a.price - b.price); // b - a for reverse sort

                // console.log(final[final.length-1]);
                final.push(item[8])
                final.push(nameOfMed)
                console.log(final)
              
                console.log('Found Everything Sir!..')
                res.render(__dirname+'/finalResults', { final: final });
            }))



});

const port = process.env.PORT || 2000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));