//DOM
let data = [];
let Zone = [];
let filterArea = [];
let filterData = [];
let areaLen = 0;
let selectArea = document.getElementById('selectArea');
let title = document.getElementById('title');
let hotBtn = document.getElementById('hotBtn');
let list = document.getElementById('list');
let page = document.getElementById('page');
//監聽
selectArea.addEventListener('change',changeList);
hotBtn.addEventListener('click',btnClick);
page.addEventListener('click',pageClick);
//AJAX
function open(){
    axios.get('https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c')
        .then(function(res){
            data = res.data.data.XML_Head.Infos.Info;
            init();
        });
}
//取得地區
function getZone(){
    let temp = [];
    for(let i = 0; i < data.length; i++){
        let str = data[i].Add;
        temp = str.split('')[6] + str.split('')[7] + str.split('')[8];
        Zone.push(temp);
    }
    let area = [...new Set(Zone)];
    let option = '<option value="全部區域">全部區域</option>';
    for(let i = 0; i < area.length; i++){
        option += `<option value="${area[i]}">${area[i]}</option>`
    }
    selectArea.innerHTML = option;
}
//篩選地區
function filterZone(area){
    filterArea = [];
    if(area == '全部區域'){
        filterArea = [...data];
    }else{
        for(let i = 0; i < data.length;i++){
            if(data[i].Add.includes(area)){
                filterArea.push(data[i]);
            }
        }
    }
    console.log(filterArea)
    areaLen = filterArea.length;
    title.textContent = area;
    pageData(1);
}
//資料交換
function changeList(e){
    let area = e.target.value;
    filterZone(area);
}
//熱門行政區
function btnClick(e){
    e.preventDefault();
    if(e.target.nodeName == 'A'){
        let area = e.target.textContent;
        selectArea.value = area;
        filterZone(area);
    }
}
//show資料
function showData(){
    let str = '';
    for(let i = 0; i < filterData.length; i++){
        str += 
        `
                <div class="card col-md-6 bg-light border-0 mb-6">
                    <div class="img position-relative" style="background-image: url(${filterData[i].Picture1})">
                        <p class="position-absolute name text-white mb-0">
                            ${filterData[i].Name}
                        </p>
                        <p class="position-absolute zone text-white mb-0">
                            ${filterData[i].Add.split('')[6] + filterData[i].Add.split('')[7] + filterData[i].Add.split('')[8]}
                        </p>
                    </div>
                    <div class="card-body bg-white">
                        <div class="opentime">
                            <img src="img/icons_clock.png" alt="opentime">
                            <span>${filterData[i].Opentime}</span>
                        </div>
                        <div class="add my-3">
                            <img src="img/icons_pin.png" alt="opentime">
                            <span>
                                ${filterData[i].Add}
                            </span>
                        </div>
                        <div class="d-flex justify-content-between">
                            <div class="tel">
                                <img src="img/icons_phone.png" alt="phone">
                                <span>${filterData[i].Tel}</span>
                            </div>
                            <div class="tag">
                                <img src="img/icons_tag.png" alt="phone">
                                <span>${filterData[i].Ticketinfo == '' ? '免費參觀' : '另外收費'}</span>
                            </div>
                        </div>
                    </div>
                </div>
        `
    }
    list.innerHTML = str;
}
//page及資料筆數
function pageData(num){
    let onePage = 6;
    let start = (num - 1) * onePage;
    let end = (num * onePage - 1) > (areaLen - 1) ? (areaLen - 1) : (num * onePage - 1);
    let Pstart = 1;
    let Allpage = Math.ceil(areaLen / onePage);//總頁數
    let str = '';
    let Pend = Allpage > 10 ? 10 : Allpage;
    filterData = [];
    for(let i = start; i <= end; i++){
        filterData.push(filterArea[i]);
    }
    showData();
    if((num - 5) > 1){
        Pstart = num - 5;
    };
    if((num + 5) > 10){
        Pend = (num + 5) > Allpage ? Allpage : (num + 5);//第11頁
    };
    if(num != 1){
        str += `<li class="page-item"><a href="#" class="page-link">Previous</a></li>`;
    }
    for(let i = Pstart; i <= Pend;i++){
        if(i == num){
            str += `<li class="page-item active"><a href="#" class="page-link">${i}</a></li>`;
        }else{
            str += `<li class="page-item"><a href="#" class="page-link">${i}</a></li>`
        }
    }
    if(num != Allpage){
        str += `<li class="page-item"><a href="#" class="page-link">Next</a></li>`;
    }
    
    page.innerHTML = str;

}
//頁面切換
function pageClick(e){
    e.preventDefault();
    if(e.target.nodeName == 'A'){
        let pageNum;
        if(e.target.textContent == 'Next'){
            pageNum = parseInt(document.querySelector('#page .active a').textContent) + 1;
        }else if(e.target.textContent == 'Previous'){
            pageNum = parseInt(document.querySelector('#page .active a').textContent) - 1;
        }else{
            pageNum = parseInt(e.target.textContent);
        }
        pageData(pageNum);
    }
}
//渲染資料
function init(){
    getZone();
    filterZone('全部區域');
}

//渲染AJAX
open();