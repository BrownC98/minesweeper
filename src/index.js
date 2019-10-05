var create = document.querySelector('input[type="button"]');
var table = document.querySelector(".table");
var msg = document.querySelector("#msg");
var data_code = {
  empty: "0",
  mine: "1",
  clicked: "2"
};

create.addEventListener("click", function (e) {
  table.innerHTML = "";
  msg.innerHTML = "";
  var minedata = [];
  var click_lock = false;
  var row = parseInt(document.querySelector('input[placeholder="세로"]').value);
  var col = parseInt(document.querySelector('input[placeholder="가로"]').value);
  var mine_number = parseInt(
    document.querySelector('input[placeholder="지뢰갯수"]').value
  );

  for (var i = 0; i < row; ++i) {
    var tr = document.createElement("tr");
    minedata.push([]);
    for (var j = 0; j < row; ++j) {
      var td = document.createElement("td");
      minedata[i].push("0");
      td.addEventListener("click", function (e) {
        if (!click_lock) {
          //클릭칸에 주변 8칸 지뢰 개수 출력
          //막힘 - 어떻게 e.currnettarget의 인덱스를 알아내는가? -> indexOf사용
          //클릭한 위치의 인덱스 파악
          var clicked_point = e.currentTarget;
          var parent_tr = clicked_point.parentNode;
          var tbody = parent_tr.parentNode;

          var click_row = Array.prototype.indexOf.call(
            tbody.children,
            parent_tr
          );
          var click_col = Array.prototype.indexOf.call(
            parent_tr.children,
            clicked_point
          );

          //주변칸에 지뢰가 몇개인지 확인
          var mine_aroundcount = 0;
          if (minedata[click_row - 1]) {
            mine_aroundcount += [
              minedata[click_row - 1][click_col - 1],
              minedata[click_row - 1][click_col],
              minedata[click_row - 1][click_col + 1]
            ].filter(v => {
              if (v === data_code.mine) return true;
            }).length;
          }``

          mine_aroundcount += [
            minedata[click_row][click_col - 1],
            minedata[click_row][click_col + 1]
          ].filter(v => {
            if (v === data_code.mine) return true;
          }).length;

          if (minedata[click_row + 1]) {
            mine_aroundcount += [
              minedata[click_row + 1][click_col - 1],
              minedata[click_row + 1][click_col],
              minedata[click_row + 1][click_col + 1]
            ].filter(v => {
              if (v === data_code.mine) return true;
            }).length;
          }
          clicked_point.classList.add("opened");

          if (minedata[click_row][click_col] === data_code.mine) {
            clicked_point.textContent = "펑";
            msg.textContent = "아이고 난!";
            click_lock = true;
          } else {
            clicked_point.textContent = mine_aroundcount;
            minedata[click_row][click_col] = data_code.clicked;
          }
          if (clicked_point.textContent === "0") {
            var wiilclick = [];
            if (table.children[click_row - 1]) {
              wiilclick = wiilclick.concat(table.children[click_row - 1].children[click_col - 1],
                table.children[click_row - 1].children[click_col],
                table.children[click_row - 1].children[click_col + 1]
              )
            }

            wiilclick = wiilclick.concat(
              table.children[click_row].children[click_col - 1],
              table.children[click_row].children[click_col + 1]
            )

            if (table.children[click_row + 1]) {
              wiilclick = wiilclick.concat(table.children[click_row + 1].children[click_col - 1],
                table.children[click_row + 1].children[click_col],
                table.children[click_row + 1].children[click_col + 1]
              )
            }
            wiilclick.filter((v) => !!v).forEach((v) => {
              var tr = v.parentNode;
              var tbody = tr.parentNode;
              var row = Array.prototype.indexOf.call(tbody.children, tr);
              var col = Array.prototype.indexOf.call(tr.children, v);
              console.log(row, col);
              if (minedata[row][col] !== data_code.clicked)//아직 클릭을 안한 곳이라면 클릭
                v.click()
            });
          }
        }
      });
      tr.append(td);
    }
    table.append(tr);
  }

  // 랜덤한 위치에 지뢰 깔기
  var mine_index = [];
  var mine_index_candidate = Array(col * row)
    .fill()
    .map((e, index) => index);

  while (mine_index.length < mine_number) {
    var picked_index = Math.floor(Math.random() * mine_index_candidate.length);
    mine_index.push(mine_index_candidate.splice(picked_index, 1));
  }

  mine_index.forEach(v => {
    var mine_row = parseInt(v / row);
    var mine_col = parseInt(v % col);
    minedata[mine_row][mine_col] = data_code.mine;
    table.children[mine_row].children[mine_col].textContent = "X";
  });
});
