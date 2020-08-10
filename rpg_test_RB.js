/**
 * (string) room
 * (string) sender
 * (boolean) isGroupChat
 * (void) replier.reply(message)
 * (boolean) replier.reply(room, message, hideErrorToast = false) // 전송 성공시 true, 실패시 false 반환
 * (string) imageDB.getProfileBase64()
 * (string) packageName
 */ // RPG test bot / ver. 1.1.1
//special thanks _ acr8n님 _ 북극여우님 _ 뀨야님 _ 퓨퓨님

function response(
    room,
    msg,
    sender,
    isGroupChat,
    replier,
    imageDB,
    packageName
) {
    var player = {
        name: sender,
        Lv: 1,
        EXP: 0,
        maxExp: 100,
        Hp: 8,
        maxHp: 8,
        G: 0,
        att: 1,
        map: 00,
        mapData: {
            ID: 0,
        }
    };
    var playerData = JSON.stringify(player);
    var playermaxExp = player.maxExp;
    var path = "/storage/emulated/0/profile/";
    var FS = FileStream;
    if (msg == "/명령어")
        replier.reply(
            "/명령어" +
            "\n" +
            "/생성" +
            "\n" +
            "/내정보" +
            "\n" +
            "/장소" +
            "\n" +
            "/장소 이동 id" +
            "\n" +
            "/상점" +
            "\n" +
            "/구매 id" +
            "\n" +
            "/룰렛" +
            "\n" +
            "/사용 id" +
            "\n" +
            "/가방" +
            "\n" +
            "/사냥"
        );
    if (sender.indexOf("/") > -1) {
        sender = sender.replace(/[/]/g, "");
    }
    if (sender.indexOf(" ") > -1) {
        sender = sender.replace(/ /g, "");
    }

    if (msg == "/장소")
        replier.reply(
            "마을 (id : 00)" +
            "\n" +
            "드넓은 평원 (id : 01)" +
        );

    if (msg == "/장소 이동") replier.reply("장소id를 입력해주세요.");
    if (msg == "/장소 이동 00") {
        replier.reply("마을로 이동합니다...");
        player.mapData.ID = 0;
    }
    if (msg == "/장소 이동 01") {
        replier.reply("드넓은 평원으로 이동합니다..." + "\n" + "권장레벨 : 1 ~ 12");
        player.mapData.ID = 1;

    if (msg == "/상점"){
        replier.reply(
            "무기뽑기권 (Lv. 1 ~ Lv.10) / 2,500 G / id 000" +
            "\n" +
            "\n" +
            "랜덤경험치병(XXXS ~ XS)(Lv. 1 ~ Lv. 10) / 2,000G / id 001"
        );
        if (player.mapData.ID !== 0)
          replier.reply ("마을로 이동한 후에 상점을 이용해주세요.")
    }

    if (msg == "/구매 000") {
        if (playerG >= 2500) {
            playerG - 2500;
        } else {
            replier.reply("골드가 부족합니다.");
        }
        var r = Math.floor(Math.random() * 9);
        if (r == 0) {
            replier.reply("아무것도 나오지 않았네요...");
        }
        if (r == 1) {
            replier.reply("경험치병 (XXXS) X1 획득! 자동사용됩니다 (20EXP 획득)");
            playerEXP + 20;
        }
        if (r == 2) {
            replier.reply("경험치병 (XXS) X1 획득! 자동사용됩니다 (50EXP 획득)");
            playerEXP + 50;
        }
        if (r == 3 && 4) {
            replier.reply(
                "'금간 나무검'(id : a) 획득! /가방으로 아이템을 확인하세요!"
            );
        }
        if (r == 5) {
            replier.reply(
                "'일반 나무검'(id : b) 획득! /가방으로 아이템을 확인하세요!"
            );
        }
        if (r == 6) {
            replier.reply(
                "'단단한 나무검'(id : c) 획득! /가방으로 아이템을 확인하세요!"
            );
        }
        if (r == 7) {
            replier.reply("'금간 돌검'(id : e) 획득! /가방으로 아이템을 확인하세요!");
        }
        if (r == 8) {
            replier.reply("'일반 돌검'(id : f) 획득! /가방으로 아이템을 확인하세요!");
        }
        //ex 무기이름 레벨제한 공격력증가 / 맨손 L1 0 / 금간나무검 L1 1 / 일반나무검 L3 2
        //단단한나무검 L4 3 / 매우단단한나무검 L7 5(사냥으로 1%드랍) / 금간돌검 L7 4 / 일반돌검 L10 6
    }

    if (msg == "/구매 001") {
        if (playerG >= 2000) {
            playerG - 2000;
        } else {
            replier.reply("골드가 부족합니다.");
        }
        var j = Math.floor(Math.random() * 4);
        if (j == 0 && 1) {
            replier.reply("XXXS 경험치병 획득! 자동사용됩니다(20EXP 획득)");
            playerEXP + 20;
        }
        if (j == 2) {
            replier.reply("XXS 경험치병 획득! 자동사용됩니다(50EXP 획득)");
            playerEXP + 50;
        }
        if (j == 3) {
            replier.reply("XS 경험치병 획득! 자동사용됩니다(100EXP 획득)");
            playerEXP + 100;
        }
    }

    if(msg=="/사냥"){
        var j = Math.floor(Math.random() * 5);
        if (j == 0) {
            

        }
        if (j == 1) {
            

        }
        if (j == 2) {
        

        }
        if (j == 3) {

   
        }
        if (j == 4){
         

        }
    }
    

    if (msg == "/생성") {
        try {
            var check = JSON.parse(
                FS.read(path + "playerData/" + sender + "/" + sender + ".json")
            );
            if (check.name == sender) {
                replier.reply(
                    "《!》" +
                    check.name +
                    "님은 이미 생성하셨어요!\n채팅창에 '/내정보'를 쳐서 확인 해보세요!"
                );
            }
        } catch (e) {
            replier.reply("《!》생성 승인중. 잠시만 기다려 주세요!");
            FS.write(
                path + "playerData/" + sender + "/" + sender + ".json",
                playerData
            );
            var inv = [];
            var invData = JSON.stringify(inv);
            FS.write(path + "playerData/" + sender + "/inv.json", invData);
            replier.reply(
                "《!》 생성이 완료되었어요!\n채팅창에 '/내정보'를 쳐보세요!"
            );
        }
    }

    if (playerEXP >= playermaxExp) {
        playerLv + 1;
        replier.reply("Level UP! " + playerLv + "레벨이 되었습니다!");
        playerEXP - playermaxExp;
        playermaxExp + playerLv * 10;
    }

    if (msg == "/내정보") {
        try {
            var h = JSON.parse(
                FS.read(path + "playerData/" + sender + "/" + sender + ".json")
            );
            if (h.name == sender) {
            }
        } catch (e) {
            replier.reply(
                "정보를 생성하시지 않았습니다.\n/생성'으로 생성해주세요."
            );
        }
        var invData = JSON.parse(
            FS.read(path + "playerData/" + sender + "/inv.json")
        );
        var playerData = JSON.parse(
            FS.read(path + "playerData/" + sender + "/" + sender + ".json")
        );
        var playerLv = playerData.Lv;
        var playerEXP = playerData.EXP;
        var playerHp = playerData.Hp;
        var playermaxHp = playerData.maxHp;
        var playerG = playerData.G;
        var playeratt = playerData.att;
        var playername = playerData.name;
        var mapID = player.mapData.ID;
        // var itemID = itemData.ID;
        // var itemLv = itemData.Lv;

        if (invData == "") {
            invData = "아이템없음.";
        }
        replier.reply(
            sender +
            "님의 프로필\nLv" +
            " " +
            "." +
            " " +
            playerLv +
            " | Hp" +
            " " +
            playerHp +
            " " +
            "/" +
            " " +
            playermaxHp +
            "\nEXP :" +
            " " +
            playerEXP +
            " " +
            "/" +
            " " +
            playermaxExp +
            " " +
            (playerEXP/maxEXP.tofixed(3)) +
            "\n" +
            playerG +
            " "+
            "G" +
            "\n" +
            playeratt +
            "ATK"
        );
    }
}
