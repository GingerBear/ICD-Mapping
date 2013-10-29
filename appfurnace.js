function openUrl1() {
    af.openLinkInWebBrowser("http://www.upmc.com/media/NewsReleases/2013/Pages/upmc-local-artists-join-forces-to-honor-BRA-day.aspx");
}


function openUrl2() {
    af.openLinkInWebBrowser("http://www.cms.gov/Medicare/Coding/ICD10/Latest_News.html");
} 

function openUrl3() {
    af.openLinkInWebBrowser("http://www.upmc.com/media/NewsReleases/2013/Pages/upmc-local-artists-join-forces-to-honor-BRA-day.aspx");
} 

function openUrl4() {
    af.openLinkInWebBrowser("http://www.upmc.com/media/NewsReleases/2013/Pages/qvc-presents-FFANY-shoes-on-sale-to-benefit-upci.aspx");
} 


// Use this countdown date:
var end = new Date('10/01/2014 00:00 AM');

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
    var now = new Date();
    var distance = end - now;
    if (distance < 0) {

        clearInterval(timer);
        ui.countdown.text('COUNTDOWN to ICD-10 FINISHED!');

        return;
    }
    var days = Math.floor(distance / _day);
    var hours = Math.floor((distance % _day) / _hour);
    var minutes = Math.floor((distance % _hour) / _minute);
    var seconds = Math.floor((distance % _minute) / _second);

    var countdown = days + 'days   ';
    countdown += hours + 'hrs   ';
    countdown += minutes + 'mins   ';
    countdown += seconds + 'secs   ';

    ui.countdown.text(countdown);
}

timer = setInterval(showRemaining, 1000);

// ICD Keyword Serch
function icdtextsubmit() {    
    if (ui.icdtext.text() === '') {
        popup("Please Input the Keyword");
    }else{
        ui.icd_search_keyword.text(ui.icdtext.text());
        navigate.to(ui.keyword_result_page.name());        
    }
}
ui.keyword_result_page.showFunction(function icdtextsubmit() {
  var $target = $('div[data-var="ui.keywork_result_area"]').children('.content').children('.content').html('Loading...');
  $.ajax({
    type: 'GET',
    url:"http://icd.gxding.com/icd/keyword",
    data:{keyword: ui.icd_search_keyword.text()},
    dataType: 'jsonp',
    success:submitSuccess,
    error:submitError
  });
});

function submitSuccess(data, statusText, status) {
         var $target = $('div[data-var="ui.keywork_result_area"]')
                        .css({'overflow-y':'scroll'})
                        .children('.content').children('.content')
                        .css({'height':'auto'})
                        .html('<div style="margin-bottom:3px;"><span style="display:inline-block; padding: 3px 5px; background: #6c40dd; color: #fff;">ICD-9</span> <span style="display:inline-block; padding: 3px 5px; background: #7f007f; color: #fff;">ICD-10</span></div>');
                        
        if (!data.empty) {            
            for (var i = data.icd_9.length - 1; i >= 0; i--) {
                var $el = $('<div></div>');
                $el.append($('<div style="clear: both; margin-bottom: 5px;"><b style="margin-bottom: 5px; float: left; width:70px; display: inline-block; padding: 8px 3px; background: #6c40dd; color: #fff;">'+data.icd_9[i].icd_9_code+'</b><p style="background-color: #eee; margin: 0 0 0 80px; font-size: 15px;">'+data.icd_9[i].icd_9_description+'</p></div>'))
                    .appendTo($target);
            }  
            for (i = data.icd_10.length - 1; i >= 0; i--) {
                var $el2 = $('<div></div>');
                $el2.append($('<div style="clear: both; margin-bottom: 5px;"><b style="margin-bottom: 5px; float: left; width:70px; display: inline-block; padding: 8px 3px; background: #7f007f; color: #fff;">'+data.icd_10[i].icd_10_code+'</b><p style="background-color: #eee; margin: 0 0 0 80px; font-size: 15px;">'+data.icd_10[i].icd_10_description+'</p></div>'))
                    .appendTo($target);
            }  
        } else {
            $('<div>No Search Results.</div>').appendTo($target);
        }
}
function submitError(error) {
 popup("Failed with an " + error);
}

// ICD-9 Search
function searchICD9() {
    if (ui.icd9s1.text() === '' || ui.icd9s2.text() === '') {
        popup("Please Input the Right ICD-9 Code");
    }else{
        ui.icd9resulttitle.text(ui.icd9s1.text() +"."+ ui.icd9s2.text());
        navigate.to(ui.icd_9_result_page.name());        
    }
}

ui.icd_9_result_page.showFunction(function(){
  ui.icd9resultdesc.text("Loading...");
  $('div[data-var="ui.icd9resultlist"]').children('.content').children('.content').html('Loading...');
  $.ajax({
    type: 'GET',
    url:"http://icd.gxding.com/icd/9",
    data:{icd_9: ui.icd9resulttitle.text()},
    dataType: 'jsonp',
    success:submitICD9Success,
    error:submitICD9Error
  });
});

function submitICD9Success(data, statusText, status) {
        var $target = $('div[data-var="ui.icd9resultlist"]').children('.content').children('.content').css({'height':'auto'}).html('');
                        
        if (!data.empty) {            
            ui.icd9resultdesc.text(data.icd_9_description);
            for (var i = data.icd_10.length - 1; i >= 0; i--) {
                var $el = $('<div></div>');
                $el.append($('<div style="clear: both; margin-bottom: 5px;"><b style="float: left; width:70px; display: inline-block; padding: 8px 3px; background: #6c40dd; color: #fff;">'+data.icd_10[i].icd_10_code+'</b><p style="background-color: #eee; margin: 0 0 0 80px; font-size: 15px;">'+data.icd_10[i].icd_10_description+'</p></div>'))
                    .appendTo($target);
            }  
        } else {
            ui.icd9resultdesc.text((data.icd_9_description || "Invalid Code"));
            $('<div>No Search Results.</div>').appendTo($target);
        }
}
function submitICD9Error(error) {
        popup("Failed with an " + error);
}

// ICD-10 Search

function searchICD10() {
    if (ui.icd10s1.text() === '' || ui.icd10s2.text() === '') {
        popup("Please Input the Right ICD-10 Code");
    }else{
        ui.icd10resulttitle.text(ui.icd10s1.text() +"."+ ui.icd10s2.text()+" "+ ui.icd10s3.text());
        navigate.to(ui.icd_10_result_page.name());        
    }
}

ui.icd_10_result_page.showFunction(function(){
  ui.icd10resultdesc.text("Loading...");
  $('div[data-var="ui.icd10resultlist"]').children('.content').children('.content').html('Loading...');
  $.ajax({
    type: 'GET',
    url:"http://icd.gxding.com/icd/10",
    data:{icd_10: ui.icd10resulttitle.text().replace(" ", "").replace(".", "")},
    dataType: 'jsonp',
    success:submitICD10Success,
    error:submitICD10Error
  });
});

function submitICD10Success(data, statusText, status) {
        var $target = $('div[data-var="ui.icd10resultlist"]').children('.content').children('.content').css({'height':'auto'}).html('');
        if (!data.empty) {            
            ui.icd10resultdesc.text(data.icd_10_description);
            for (var i = data.icd_9.length - 1; i >= 0; i--) {
                var $el = $('<div></div>');
                $el.append($('<div style="clear: both; margin-bottom: 5px; font-family: Cabin"><b style="float: left; width:70px; display: inline-block; padding: 8px 3px; background: #7f007f; color: #fff;">'+data.icd_9[i].icd_9_code+'</b><p style="background-color: #eee; margin: 0 0 0 80px; font-size: 15px;">'+data.icd_9[i].icd_9_description+'</p></div>'))
                    .appendTo($target);
            }    
        } else {
            ui.icd10resultdesc.text((data.icd_10_description || "Invalid Code"));
            $('<div>No Search Results.</div>').appendTo($target);
        }
}
function submitICD10Error(error) {
        popup("Failed with an " + error);
}
