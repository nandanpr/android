(function(){var $get=function(id){return document.getElementById(id)};var resultsBackLink="";var resultsToShow=[];var perPage=15;var resultsIndex=0;var activityIndex=0;var selectedType=0;var transactionTypes=["typeAll","typeBP","typeCC","typeChecks","typeDeposits","typeWD"];var formDescription;var formAmtMin;var formAmtMax;var formDateBetween;var formDateAnd;var emptyDescrip;var emptyAmtMin;var emptyAmtMax;var filters=["filterAll","filterDeposits","filterChecks","filterDebits"];var selectedFilter=0;var activityToShow=[];var allTransactions=[];var posturl="accountDetailSearchAjax.action";var curText="";var curSearchfield="";var prevStatus="";var timeout=-1;var keystroke_delay=0.7;var srchKey="";function updateActivity(tranRec){populateActivity(tranRec)}function populateActivity(tranRec){var i;var descripEmpty=false;activityToShow=[];if(tranRec&&typeof tranRec!=="undefined"){if(activityIndex==0&&tranRec.length>=1){tranRec=tranRec.slice(0,-14).slice(14);if(typeof(JSON)!=="undefined"&&typeof(JSON.parse)==="function"){allTransactions=JSON.parse(tranRec).activityList}else{allTransactions=eval(tranRec).activityList}}}activityToShow=allTransactions;if(activityToShow.length>0){if($get("filterError")){$get("filterError").style.display="none"}i=activityIndex;var container=document.createElement("ul");while(i<activityToShow.length&&i<(activityIndex+perPage)){var li=createTransactionListNode(activityToShow[i],i%2);container.appendChild(li);i++}$get("prevActBtn").style.display="inline";if(activityIndex>0){$get("prevActBtn").style.visibility="visible"}else{$get("prevActBtn").style.visibility="hidden"}if((activityIndex+perPage)<activityToShow.length){$get("nextActBtn").style.display="block"}else{$get("nextActBtn").style.display="none"}$get("actPageDisplay").innerHTML="Page "+(Math.floor(activityIndex/perPage)+1)+" of "+(Math.floor((activityToShow.length-1)/perPage)+1);$get("actPageDisplay").style.display="inline";$get("accountActivityContainer").innerHTML="";$get("accountActivityContainer").appendChild(container);$get("accountActivityContainer").style.display="block";$get("pagination_cnt").style.display="none";if($get("nextActBtn1")){$get("nextActBtn1").style.display="none"}if($get("prevActBtn1")){$get("prevActBtn1").style.display="none"}}else{$get("filterError").style.display="inline-block";$get("prevActBtn").style.visibility="hidden";$get("nextActBtn").style.display="none";$get("actPageDisplay").style.display="none";$get("accountActivityContainer").style.display="none";$get("pagination_cnt").style.display="block";if($get("nextActBtn1")){$get("nextActBtn1").style.display="block"}if($get("prevActBtn1")){$get("prevActBtn1").style.display="block"}}removeGlobalMask();if($get("searchingIndicator")){$get("searchingIndicator").style.display="none"}}function nextActivity(){activityIndex+=perPage;showGlobalMask(true,true);scroll(0,0);callAfterDelay(populateActivity)}function previousActivity(){activityIndex-=perPage;showGlobalMask(true,true);scroll(0,0);callAfterDelay(populateActivity)}function callAfterDelay(func){setTimeout(func,1000)}function noResults(){removeGlobalMask();$get("resultsError").style.display="block"}function createTransactionListNode(trans,shade){var li=document.createElement("li");li.className=(shade)?"listshadingNoArrow":"noshadingNoArrow";if(prevStatus=="pendingBgNoArrow"&&li.className!="pendingBgNoArrow"){li.className="noshadingNoArrow"}else{if(prevStatus=="noshadingNoArrow"){li.className="listshadingNoArrow"}else{if(prevStatus==""){li.className="listshadingNoArrow"}else{if(prevStatus=="listshadingNoArrow"){li.className="noshadingNoArrow"}}}}if(trans.status!=null){li.className="pendingBgNoArrow"}prevStatus=li.className;if(trans.image==true){li.appendChild(createLink())}else{li.appendChild(createDateNode());li.appendChild(clearImg());li.appendChild(createDescNode());li.appendChild(createRightColumnNode())}function createLink(){var lk=document.createElement("a");lk.className="sliderLink";lk.href="/mba/ImageData.html?key="+trans.type+"&isn="+trans.itemSequenceNumber+"&date="+trans.date+"&isRI="+trans.returnedItem;lk.onclick=function(event){checkDeposit.openSlider(event,lk)};lk.appendChild(createDateNode());lk.appendChild(clearImg());lk.appendChild(createDescNode());lk.appendChild(document.createElement("br"));lk.appendChild(createViewdetailIcon());lk.appendChild(createRightColumnNode());lk.appendChild(clearImg());return lk}function clearImg(){var cl=document.createElement("div");cl.className="clear";return cl}function createViewdetailIcon(){var vd=document.createElement("span");vd.className="info viewDetails";vd.innerHTML="View Details";return vd}function createRightColumnNode(){var rc=document.createElement("span");rc.className="rightcol";if(trans.status!=null){rc.className="rightcolPending"}rc.appendChild(createAmountNode());if(trans.status!=null){rc.appendChild(document.createElement("br"));rc.appendChild(createStatusNode())}return rc}function createAmountNode(){return document.createTextNode(trans.amount)}function createDateNode(){var dn=document.createElement("label");dn.className="transactionDate";if(trans.status!=null){dn.className="transactionDatePending"}dn.appendChild(document.createTextNode(trans.date));return dn}function createStatusNode(){var sn=document.createElement("label");sn.className="pendingLabelEnhanced";sn.appendChild(document.createTextNode(trans.status));return sn}function createDescNode(){var descNode=document.createElement("span");descNode.className="transDesc";if(trans.status!=null){descNode.className="transDescPending"}descNode.appendChild(document.createTextNode(trans.description));return descNode}return li}function showResults(){$get("content").style.display="none";$get("searchResults").style.display="block";removeGlobalMask();scroll(0,0)}function addEvent(obj,evType,fn){if(obj!=null){if(obj.addEventListener){obj.addEventListener(evType,fn,false);return true}else{if(obj.attachEvent){var r=obj.attachEvent("on"+evType,fn);return r}else{return false}}}}function retrieveList(key){$get("searchingIndicator").style.display="block";var req=createRequest();var d=new Date();var data="";req.onreadystatechange=function stateChanged(){if(req.readyState==4){if(req.status==200){if(req.responseText.length>0){try{activityIndex=0;updateActivity(req.responseText)}catch(e){errHandler(e.description)}}else{location.reload();return false}}else{if(req.status==404||req.status==408||req.status==500){errHandler("timeout")}}}};req.open("POST",posturl);req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");req.send("key="+escape(key))}function errHandler(desc){$get("searchingIndicator").style.display="none";if($get("filterError")){$get("filterError").innerHTML=searchResultErrMsg;$get("filterError").style.display="block"}}function createRequest(){var req;if(window.XMLHttpRequest){req=new XMLHttpRequest()}else{req=false}if(!req){try{req=new ActiveXObject("MSXML.XMLHTTP")}catch(olderMS){try{req=new ActiveXObject("Microsoft.XMLHTTP")}catch(e){}}}return req}function initSearch(srchFld){curSearchfield=srchFld;addEvent(srchFld,"keyup",function(){srchKey=(this.value);clearTimeout(timeout);timeout=setTimeout(function(){if(srchKey.length>=3&&curText!=srchKey){retrieveList(srchKey);curText=srchKey}},keystroke_delay*1000)});return true}initSearchEvents=function(){var fieldsrch=$get("searchFld");addEvent($get("nextActBtn"),"click",nextActivity);addEvent($get("prevActBtn"),"click",previousActivity);if(fieldsrch&&typeof fieldsrch!=="undefined"&&fieldsrch.className.indexOf("WFClearTF")>-1){initSearch(fieldsrch)}};initSearchClear=function(){addEvent($get("closeLink_searchFld"),"click",function(){location.reload()})};window.addEventListener("load",function(){setTimeout(initSearchEvents,720)},false);window.addEventListener("load",function(){setTimeout(initSearchClear,720)},false)})();