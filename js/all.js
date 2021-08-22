let data = [];
let selectArea = document.getElementById('selectArea');
let hotBtn = document.getElementById('hotBtn');
let title = document.getElementById('title');
let list = document.getElementById('list');
let page = document.getElementById('page');
let nowPage = 1;
axios.get('https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json')
    .then(function(res){
        data = res.data.result.records;
        init();
    });

    hotBtn.addEventListener('click',changeSelect);
    selectArea.addEventListener('change',changeTitle);
    page.addEventListener('click',changePage);
    //初始化
    function init(){
        let zone = [];
        let area = [];
        data.forEach(item =>{
            zone.push(item.Zone);
        });
        area.push(...new Set(zone));
        area.forEach(item =>{
            let str = document.createElement('option');
            str.setAttribute('value',`${item}`);
            str.textContent = `${item}`;
            selectArea.appendChild(str);
        });
        title.textContent = '全部區域';
        show('all',1);
    }

    //頁數以及資料
    function show(area,pageNum){
        let str = '';
        let zone = [];
        let len = 0;
        let pageData = ` <li class="page-item"><a class="page-link" href="#">Previous</a></li>`;
        //篩選資料
        if(area == 'all'){
            zone = data;
            len = zone.length;
        }else{
            data.forEach(item => {
                if(item.Zone === area){
                    zone.push(item);
                }
            });
            len = zone.length;
        }
        //page頁碼長度
        if(len % 10 == 0){
            total = Math.floor(len / 10);
        }else{
            total = Math.ceil(len / 4);
        }
        //page頁碼
        for(let i =0; i < total; i++){
            if(i + 1 === pageNum){
                pageData += `<li class="page-item active"><a class="page-link" href="#" data-num="${i + 1}">${i + 1}</a></li>`
            }else{
                pageData += `<li class="page-item"><a class="page-link" href="#" data-num="${i + 1}">${i + 1}</a></li>`
            };
            //data渲染
            if(i + 1 === pageNum){
                zone.forEach((item,index) =>{
                    if(index >= i * 4 && index < (i + 1) * 4){
                        str += 
                            `
                            <div class="card col-md-6 bg-light border-0 mb-6">
                                <div class="img position-relative" style="background-image: url(${item.Picture1});">
                                <p class="position-absolute name text-white mb-0">
                                    ${item.Name}
                                </p>
                                <p class="position-absolute zone text-white mb-0">
                                    ${item.Zone}
                                </p>
                            </div>
                            <div class="card-body bg-white">
                                <div class="opentime">
                                    <img src="img/icons_clock.png" alt="opentime">
                                    <span>${item.Opentime}</span>
                                </div>
                                <div class="add my-3">
                                    <img src="img/icons_pin.png" alt="add">
                                    <span>
                                        ${item.Add}
                                    </span>
                                </div>
                                <div class="d-flex justify-content-between">
                                    <div class="tel">
                                        <img src="img/icons_phone.png" alt="phone">
                                        <span>${item.Tel}</span>
                                    </div>
                                    <div class="tag">
                                        <img src="img/icons_tag.png" alt="tag">
                                        <span>${item.Ticketinfo}</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                            `
                    }
                    
                });
            }
        }

        pageData += `<li class="page-item"><a class="page-link" href="#">Next</a></li>`

        list.innerHTML = str;
        page.innerHTML = pageData;
    }
    //熱門行政區
    function changeSelect(e){
        nowPage = 1;
        e.preventDefault();
        if(e.target.nodeName != 'A'){
            return;
        }
        selectArea.value = e.target.textContent;
        title.textContent = selectArea.value;
        show(e.target.textContent,nowPage);
    }

    //select交換
    function changeTitle(e){
        nowPage = 1;
        if(e.target.value == 'all'){
            title.textContent = '全部區域';
        }else{
            title.textContent = e.target.value;
        }
        show(e.target.value,nowPage);
    }
    //頁數切換
    function changePage(e){
        e.preventDefault();
        if(e.target.nodeName !== 'A'){
            return;
        };

        if(e.target.textContent != 'Previous' && e.target.textContent != 'Next'){
            nowPage = parseInt(e.target.textContent);
        };

        if(title.textContent == '全部區域'){
            area = 'all';
        }else{
            area = selectArea.value;
        };
        
        if(e.target.textContent == 'Next'){
            if(nowPage == total){
                return;
            }
            nowPage += 1;
            show(area,nowPage);
        }else if(e.target.textContent == 'Previous'){
            if(nowPage == 1){
                return;
            }
            nowPage -= 1;
            show(area,nowPage);
        }
        
        show(area,nowPage);
    }