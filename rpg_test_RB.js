const path = "/storage/emulated/0/profile/";
const FS = FileStream;

function makeRnd(min, max) {
    x = Number(max + 1) - Number(min);
    return Math.floor(Math.random() * x) + min;
}

function haveData(name) {
    return FS.read(path + "playerData/" + name + "/" + name + ".json") == null ? false : true;
}

function updatePlayer(name) {
    return JSON.parse(FS.read(path + "playerData/" + name + "/" + name + ".json"));
}

function savePlayer(data, name) {
    FS.write(path + "playerData/" + name + "/" + name + ".json", JSON.stringify(data));
}

function updateInventory(name) {
    return JSON.parse(FS.read(path + "playerData/" + name + "/inv.json"));
}

function saveInventory(data, name) {
    FS.write(path + "playerData/" + name + "/inv.json", JSON.stringify(data)); // saveInventory(inventory, sender)
}

function addInventory(name, item, count) {
    data = (updateInventory(name))[item] += count; // addInventory(sender, "슬라임의 잔해", 1)
    saveInventory(data, name);
}

function getRndByNum(num) {
  return makeRnd(1,1000) <= num ? true : false; // num 이 1이면 1/1000 확률
}

function response(room, msg, sender, isGroupChat, replier, imageDB, packageName) {

    if (sender.indexOf("/") > -1) {
        sender = sender.replace(/[/]/g, "");
    }
    if (sender.indexOf(" ") > -1) {
        sender = sender.replace(/ /g, "");
    }
    let player = updatePlayer(sender);
    let inventory = updateInventory(sender);

    if (haveData(sender)) {
        if (player.EXP >= player.maxExp) {
            player.Lv++;
            replier.reply("Level UP! " + player.Lv + "레벨이 되었습니다!");
            player.EXP = player.EXP - player.maxExp;
            player.maxExp = Math.floor(player.maxExp * (11 / 10));
            player.maxHp += 3;
            player.att = player.att += 0.5;
            savePlayer(player, sender);
        }
    }

    if (room == "RPG text game 플레이방 (1채널)")

        if (msg == "/명령어") {
            replier.reply("/명령어" + "\n" + "/생성" + "\n" + "/내정보" + "\n" + "/장소" + "\n" + "/장소 이동 id" + "\n" + "/상점" + "\n" + "/회복" + "\n" + "/사냥");
            return;
        }

    if (msg == "/생성") {
        if (haveData(sender)) {
            replier.reply("《!》" + sender + "님은 이미 생성하셨어요!\n채팅창에 '/내정보'를 쳐서 확인 해보세요!");
            return;
        }
        replier.reply("《!》생성 승인중. 잠시만 기다려 주세요!");
        let jsonbase = {
            name: sender,
            Lv: 1,
            EXP: 0,
            maxExp: 100,
            Hp: 8,
            maxHp: 8,
            G: 0,
            att: 1,
            h: false,
            map: 00,
            mapData: {
                ID: 00
            }
        };
        let invbase = {
            "슬라임의 잔해": 0,
            "슬라임 군주 소환서": 0
        };
        FS.write(path + "playerData/" + sender + "/" + sender + ".json", JSON.stringify(jsonbase));
        FS.write(path + "playerData/" + sender + "/inv.json", JSON.stringify(invbase));
        replier.reply("《!》 생성이 완료되었어요!\n채팅창에 '/내정보'를 쳐보세요!");
        return;
    }

    if (msg == "/내정보") {
        if (!haveData(sender)) {
            replier.reply("정보를 생성하시지 않았습니다.\n/생성'으로 생성해주세요.");
            return;
        }

        var invData = JSON.parse(
            FS.read(path + "playerData/" + sender + "/inv.json")
        );

        if (invData == "") {
            invData = "아이템 없음";
        }

        replier.reply(
            sender + "님의 프로필\nLv" + "." + " " + player.Lv + " | Hp:" + " " + player.Hp + " " + "/" + " " + player.maxHp +
            "\nEXP:" + " " + player.EXP + " / " + player.maxExp + "\n" + player.G + " " + "G" + "\n" + player.att + " ATK"
        );
        return;
    }

    if (msg == "/가방") {
        let res = "";
        inventory.forEach(i => {
            k = Object.getOwnPropertyNames(i)
            if (i[k[0]] != 0) {
                res += "\n", res += k[0], res += ": ", res += i[k[0]], res += "개";
            }
        })
        replier.reply(sender + "님의 가방" + res);
        return;
    }

    if (msg == "/장소") {
        replier.reply("마을 (id : 00)" + "\n" + "드넓은 평원 (id : 01)" + "\n" + "슬라임 서식지 (id : 02)" + "\n" + "한적한 해변 (id : 03)");
        return;
    }

    if (msg == "/장소 이동") {
        replier.reply("장소id를 입력해주세요.");
        return;
    }

    if (msg == "/장소 이동 00") {
        replier.reply("마을로 이동합니다...");
        player.mapData.ID = 00;
        savePlayer(player, sender);
        return;
    }

    if (msg == "/장소 이동 01") {
        replier.reply("드넓은 평원으로 이동합니다..." + "\n" + "권장레벨 : 1~7");
        player.mapData.ID = 01;
        savePlayer(player, sender);
        return;
    }

    if (msg == "/장소 이동 02") {
        replier.reply("슬라임 서식지로 이동합니다..." + "\n" + "권장레벨 : 8~17");
        player.mapData.ID = 02;
        savePlayer(player, sender);
        return;
    }

    if (msg == "/장소 이동 03") {
        replier.reply("한적한 해변으로 이동합니다..." + "\n" + "권장레벨 : 18~26");
        player.mapData.ID = 03;
        savePlayer(player, sender);
        return;
    }

    if (msg == "/상점") {
        replier.reply("준비중입니다.");
        return;
    }

    if (msg == "/회복" && player.Hp == 0) {
        if (!player.h) {
            player.h = true;
            savePlayer(player, sender);
            replier.reply((player.maxHp) * 3 + '초 후 회복완료');
            java.lang.Thread.sleep(Number((player.maxHp) * 4) * 1000);
            player.Hp = player.maxHp;
            player.h = false;
            savePlayer(player, sender);
            replier.reply('회복 완료!');
            return;
        }
        if (player.h) {
            replier.reply('이미 회복중입니다');
            return;
        }
    }

    if (msg == "/사냥" && player.mapData.ID == 00) { //마을에서 안된다는거 따로 분리했어요
        replier.reply("마을에서는 사냥할 수 없습니다");
        return;
    }

    if (msg == "/사냥" && player.mapData.ID == 01 /*맵 만드실때마다 여기 if문을 복사하셔서 바꾸세요*/ ) {

        if (player.Hp == 0) {
            replier.reply("Hp가 부족합니다. '/회복' 으로 Hp를 채워주세요");
            return;
        }

        let n = makeRnd(0, 1);

        switch (n) {
            case 0:

                if (player.att <= 2 /*몬스터공격력*/ ) {
                    diff = Math.abs(2 /*몬스터공격력*/ - Number(player.att)) + 1;
                    rd = makeRnd(1, 10) <= diff;
                    if (rd) {
                        replier.reply('초록슬라임 [Lv . 1] 이(가) 당신의 공격을 피했습니다.');
                        return;
                    }
                }

                a = makeRnd(3, 10);
                b = makeRnd(10, 75);
                c = makeRnd(0, 1);
                player.EXP += a;
                player.G += b;
                player.Hp -= c;
                if (player.Hp < 0) player.Hp = 0;
                savePlayer(player, sender);
                if(getRndByNum(5)) {
                  addInventory(sender, "슬라임의 잔해", 1);
                  saveInventory(updateInventory(sender), sender);
                }
                replier.reply(sender + " 님이 초록 슬라임 [Lv . 1] 을(를) 잡았습니다!\nEXP + " + a + "\nG + " + b + "\nHp - " + c);
                break;

            case 1:
                if (player.Lv < 4) {
                    replier.reply('레벨이 낮아 "노란슬라임 [Lv . 4] 을(를) 잡지 못했습니다...');
                    return;
                }

                if (player.att <= 4 /*몬스터공격력*/ ) {
                    diff = Math.abs(4 /*몬스터공격력*/ - Number(player.att)) + 1;
                    rd = makeRnd(1, 10) <= diff;
                    if (rd) {
                        replier.reply('"노란슬라임 [Lv . 4] 이(가) 당신의 공격을 피했습니다.');
                        return;
                    }
                }

                a = makeRnd(4, 13);
                b = makeRnd(20, 95);
                c = makeRnd(1, 2);
                player.EXP += a;
                player.G += b;
                player.Hp -= c;
                if (player.Hp < 0) player.Hp = 0;
                savePlayer(player, sender);
                replier.reply(sender + " 님이 ''노란 슬라임'' [Lv . 4] 을(를) 잡았습니다!\nEXP + " + a + "\nG + " + b + "\nHp - " + c);
                break;

            default:
                break;

        }

    }

    if (msg == "/사냥" && player.mapData.ID == 02 /*맵 만드실때마다 여기 if문을 복사하셔서 바꾸세요*/ ) {

        if (player.Hp == 0) {
            replier.reply("Hp가 부족합니다. '/회복' 으로 Hp를 채워주세요");
            return;
        }

        let n = makeRnd(0, 1);

        switch (n) {
            case 0:
                if (player.Lv < 8) {
                    replier.reply('레벨이 낮아 "파란슬라임 [Lv . 8] 을(를) 잡지 못했습니다...');
                    return;
                }


                if (player.att <= 7 /*몬스터공격력*/ ) {
                    diff = Math.abs(7 /*몬스터공격력*/ - Number(player.att)) + 1;
                    rd = makeRnd(1, 10) <= diff;
                    if (rd) {
                        replier.reply('"파란슬라임 [Lv . 8]" 이(가) 당신의 공격을 피했습니다.');
                        return;
                    }
                }

                a = makeRnd(7, 15);
                b = makeRnd(30, 135);
                c = makeRnd(2, 4);
                player.EXP += a;
                player.G += b;
                player.Hp -= c;
                if (player.Hp < 0) player.Hp = 0;
                savePlayer(player, sender);
                replier.reply(sender + " 님이 파란슬라임 [Lv . 8] 을(를) 잡았습니다!\nEXP + " + a + "\nG + " + b + "\nHp - " + c);
                break;

            case 1:
                if (player.Lv < 13) {
                    replier.reply('레벨이 낮아 "빨간슬라임 [Lv . 13]" 을(를)잡지 못했습니다...');
                    return;
                }

                if (player.att <= 7 /*몬스터공격력*/ ) {
                    diff = Math.abs(7 /*몬스터공격력*/ - Number(player.att)) + 1;
                    rd = makeRnd(1, 10) <= diff;
                    if (rd) {
                        replier.reply('"빨간슬라임 [Lv . 13]" 이(가) 당신의 공격을 피했습니다.');
                        return;
                    }
                }

                a = makeRnd(8, 18);
                b = makeRnd(40, 165);
                c = makeRnd(2, 6);
                player.EXP += a;
                player.G += b;
                player.Hp -= c;
                if (player.Hp < 0) player.Hp = 0;
                savePlayer(player, sender);
                replier.reply(sender + " 님이 빨간슬라임 [Lv . 13] 을(를) 잡았습니다!\nEXP + " + a + "\nG + " + b + "\nHp - " + c);
                break;

            default:
                break;

        }

    }

    if (msg == "/사냥" && player.mapData.ID == 03 /*맵 만드실때마다 여기 if문을 복사하셔서 바꾸세요*/ ) {

        if (player.Hp == 0) {
            replier.reply("Hp가 부족합니다. '/회복' 으로 Hp를 채워주세요");
            return;
        }

        let n = makeRnd(0, 1);

        switch (n) {
            case 0:
                if (player.Lv < 18) {
                    replier.reply('레벨이 낮아 "심해어 [Lv . 18]" 을(를) 잡지 못했습니다...');
                    return;
                }


                if (player.att <= 14 /*몬스터공격력*/ ) {
                    diff = Math.abs(14 /*몬스터공격력*/ - Number(player.att)) + 1;
                    rd = makeRnd(1, 10) <= diff;
                    if (rd) {
                        replier.reply('"심해어 [Lv . 18]" 이(가) 당신의 공격을 피했습니다.');
                        return;
                    }
                }

                a = makeRnd(10, 20);
                b = makeRnd(55, 235);
                c = makeRnd(3, 9);
                player.EXP += a;
                player.G += b;
                player.Hp -= c;
                if (player.Hp < 0) player.Hp = 0;
                savePlayer(player, sender);
                replier.reply(sender + " 님이 심해어 [Lv . 18] 을(를) 잡았습니다!\nEXP + " + a + "\nG + " + b + "\nHp - " + c);
                break;

            case 1:
                if (player.Lv < 22) {
                    replier.reply('레벨이 낮아 "상어 [Lv . 22]" 을(를)잡지 못했습니다...');
                    return;
                }

                if (player.att <= 16 /*몬스터공격력*/ ) {
                    diff = Math.abs(16 /*몬스터공격력*/ - Number(player.att)) + 1;
                    rd = makeRnd(1, 10) <= diff;
                    if (rd) {
                        replier.reply('"상어 [Lv . 22]" 이(가) 당신의 공격을 피했습니다.');
                        return;
                    }
                }

                a = makeRnd(13, 24);
                b = makeRnd(65, 280);
                c = makeRnd(4, 11);
                player.EXP += a;
                player.G += b;
                player.Hp -= c;
                if (player.Hp < 0) player.Hp = 0;
                savePlayer(player, sender);
                replier.reply(sender + " 님이 상어 [Lv . 22] 을(를) 잡았습니다!\nEXP + " + a + "\nG + " + b + "\nHp - " + c);
                break;

            default:
                break;

        }

    }


}
