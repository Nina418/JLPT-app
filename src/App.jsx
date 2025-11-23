import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, CheckCircle, RotateCcw, Trophy, Volume2, 
  ChevronRight, ArrowLeft, XCircle, Sun, Moon, Lock,
  Sparkles, Flame, ArrowRight, Repeat, AlertCircle, User, Award,
  GraduationCap, Settings, Mic, Grid, HelpCircle, Eraser
} from 'lucide-react';

// -----------------------------------------------------------------------------
// 五十音資料庫
// -----------------------------------------------------------------------------
const KANA_DATA = [
  { row: 'a', hira: ['あ','い','う','え','お'], kata: ['ア','イ','ウ','エ','オ'], romaji: ['a','i','u','e','o'] },
  { row: 'k', hira: ['か','き','く','け','こ'], kata: ['カ','キ','ク','ケ','コ'], romaji: ['ka','ki','ku','ke','ko'] },
  { row: 's', hira: ['さ','し','す','せ','そ'], kata: ['サ','シ','ス','セ','ソ'], romaji: ['sa','shi','su','se','so'] },
  { row: 't', hira: ['た','ち','つ','て','と'], kata: ['タ','チ','ツ','テ','ト'], romaji: ['ta','chi','tsu','te','to'] },
  { row: 'n', hira: ['な','に','ぬ','ね','の'], kata: ['ナ','ニ','ヌ','ネ','ノ'], romaji: ['na','ni','nu','ne','no'] },
  { row: 'h', hira: ['は','ひ','ふ','へ','ほ'], kata: ['ハ','ヒ','フ','ヘ','ホ'], romaji: ['ha','hi','fu','he','ho'] },
  { row: 'm', hira: ['ま','み','む','め','も'], kata: ['マ','ミ','ム','メ','モ'], romaji: ['ma','mi','mu','me','mo'] },
  { row: 'y', hira: ['や','','ゆ','','よ'], kata: ['ヤ','','ユ','','ヨ'], romaji: ['ya','','yu','','yo'] },
  { row: 'r', hira: ['ら','り','る','れ','ろ'], kata: ['ラ','リ','ル','レ','ロ'], romaji: ['ra','ri','ru','re','ro'] },
  { row: 'w', hira: ['わ','','','','を'], kata: ['ワ','','','','ヲ'], romaji: ['wa','','','','wo'] },
  { row: 'nn', hira: ['ん','','','',''], kata: ['ン','','','',''], romaji: ['n','','','',''] },
];

const FLAT_KANA = [];
KANA_DATA.forEach(group => {
  group.hira.forEach((char, idx) => {
    if (char) FLAT_KANA.push({ char: char, romaji: group.romaji[idx], type: 'hira' });
  });
  group.kata.forEach((char, idx) => {
    if (char) FLAT_KANA.push({ char: char, romaji: group.romaji[idx], type: 'kata' });
  });
});

// -----------------------------------------------------------------------------
// JLPT 分級詞彙資料庫 (N5 大幅擴充版 + CSV 整合)
// -----------------------------------------------------------------------------
const JLPT_DATA = {
  "N5": [ 
    // --- 代名詞・人物 (整合 CSV 資料) ---
    { id: "n5_1", word: "私", reading: "わたし", part: "代", def: "我", example: "私は学生です。", example_cn: "我是學生。" },
    { id: "n5_csv_1", word: "彼", reading: "かれ", part: "代", def: "他", example: "彼は学生です。", example_cn: "他是學生。" },
    { id: "n5_csv_2", word: "彼女", reading: "かのじょ", part: "代", def: "她", example: "彼女は親切です。", example_cn: "她很親切。" },
    { id: "n5_30", word: "家族", reading: "かぞく", part: "名", def: "家人", example: "家族は4人です。", example_cn: "家裡有四個人。" },
    { id: "n5_csv_3", word: "両親", reading: "りょうしん", part: "名", def: "父母", example: "両親に手紙を書く。", example_cn: "寫信給父母。" },
    { id: "n5_csv_4", word: "祖父", reading: "そふ", part: "名", def: "爺爺/外公", example: "祖父は元気です。", example_cn: "爺爺很健康。" },
    { id: "n5_csv_5", word: "祖母", reading: "そぼ", part: "名", def: "奶奶/外婆", example: "祖母の家へ行く。", example_cn: "去奶奶家。" },
    { id: "n5_52", word: "父", reading: "ちち", part: "名", def: "家父", example: "父は会社員です。", example_cn: "我父親是公司職員。" },
    { id: "n5_53", word: "母", reading: "はは", part: "名", def: "家母", example: "母は料理が上手です。", example_cn: "我母親很會做菜。" },
    { id: "n5_csv_6", word: "兄弟", reading: "きょうだい", part: "名", def: "兄弟姊妹", example: "兄弟がいますか。", example_cn: "有兄弟姊妹嗎？" },
    { id: "n5_csv_7", word: "兄", reading: "あに", part: "名", def: "哥哥(自稱)", example: "兄は背が高いです。", example_cn: "哥哥個子很高。" },
    { id: "n5_csv_8", word: "姉", reading: "あね", part: "名", def: "姊姊(自稱)", example: "姉は銀行員です。", example_cn: "姊姊是銀行員。" },
    { id: "n5_78", word: "弟", reading: "おとうと", part: "名", def: "弟弟(自稱)", example: "弟が一人います。", example_cn: "我有一個弟弟。" },
    { id: "n5_79", word: "妹", reading: "いもうと", part: "名", def: "妹妹(自稱)", example: "妹は可愛いです。", example_cn: "妹妹很可愛。" },
    { id: "n5_6", word: "友達", reading: "ともだち", part: "名", def: "朋友", example: "友達と遊びます。", example_cn: "和朋友玩。" },
    { id: "n5_48", word: "人", reading: "ひと", part: "名", def: "人", example: "あの人は誰ですか。", example_cn: "那個人是誰？" },
    { id: "n5_49", word: "男", reading: "おとこ", part: "名", def: "男", example: "男の子がいます。", example_cn: "有個男孩子。" },
    { id: "n5_50", word: "女", reading: "おんな", part: "名", def: "女", example: "女の子がいます。", example_cn: "有個女孩子。" },
    { id: "n5_51", word: "子供", reading: "こども", part: "名", def: "小孩", example: "子供と遊びます。", example_cn: "和小孩玩。" },
    { id: "n5_54", word: "先生", reading: "せんせい", part: "名", def: "老師；醫生", example: "日本語の先生。", example_cn: "日文老師。" },
    { id: "n5_55", word: "学生", reading: "がくせい", part: "名", def: "學生", example: "私は学生です。", example_cn: "我是學生。" },
    { id: "n5_67", word: "誰", reading: "だれ", part: "代", def: "誰", example: "あれは誰ですか。", example_cn: "那個人是誰？" },
    { id: "n5_71", word: "大人", reading: "おとな", part: "名", def: "大人；成人", example: "大人一枚ください。", example_cn: "請給我一張全票。" },
    { id: "n5_72", word: "医者", reading: "いしゃ", part: "名", def: "醫生", example: "医者になりたいです。", example_cn: "我想當醫生。" },
    { id: "n5_73", word: "外国人", reading: "がいこくじん", part: "名", def: "外國人", example: "日本には外国人が多いです。", example_cn: "日本有很多外國人。" },
    { id: "n5_76", word: "お兄さん", reading: "おにいさん", part: "名", def: "哥哥(尊稱)", example: "お兄さんは元気ですか。", example_cn: "你哥哥好嗎？" },
    { id: "n5_77", word: "お姉さん", reading: "おねえさん", part: "名", def: "姊姊(尊稱)", example: "綺麗なお姉さん。", example_cn: "漂亮的姊姊。" },

    // --- 形容詞 (整合 CSV 資料：強弱、輕重、快慢、粗細) ---
    { id: "n5_4", word: "大きい", reading: "おおきい", part: "形一", def: "大的", example: "これは大きい鞄です。", example_cn: "這是個大包包。" },
    { id: "n5_39", word: "小さい", reading: "ちいさい", part: "形一", def: "小的", example: "小さい鞄。", example_cn: "小的包包。" },
    { id: "n5_9", word: "新しい", reading: "あたらしい", part: "形一", def: "新的", example: "新しい車を買いました。", example_cn: "買了新車。" },
    { id: "n5_12", word: "高い", reading: "たかい", part: "形一", def: "貴的；高的", example: "この本は高いです。", example_cn: "這本書很貴。" },
    { id: "n5_13", word: "安い", reading: "やすい", part: "形一", def: "便宜的", example: "これは安いです。", example_cn: "這個很便宜。" },
    { id: "n5_46", word: "近い", reading: "ちかい", part: "形一", def: "近的", example: "駅は近いです。", example_cn: "車站很近。" },
    { id: "n5_47", word: "遠い", reading: "とおい", part: "形一", def: "遠的", example: "学校は遠いです。", example_cn: "學校很遠。" },
    { id: "n5_csv_9", word: "強い", reading: "つよい", part: "形一", def: "強的", example: "風が強い。", example_cn: "風很強。" },
    { id: "n5_csv_10", word: "弱い", reading: "よわい", part: "形一", def: "弱的", example: "力が弱い。", example_cn: "力氣很小。" },
    { id: "n5_csv_11", word: "重い", reading: "おもい", part: "形一", def: "重的", example: "この荷物は重いです。", example_cn: "這個行李很重。" },
    { id: "n5_csv_12", word: "軽い", reading: "かるい", part: "形一", def: "輕的", example: "軽い鞄。", example_cn: "很輕的包包。" },
    { id: "n5_csv_13", word: "早い", reading: "はやい", part: "形一", def: "早的", example: "朝起きるのが早いです。", example_cn: "早上起得早。" },
    { id: "n5_csv_14", word: "速い", reading: "はやい", part: "形一", def: "快的(速度)", example: "走るのが速い。", example_cn: "跑得很快。" },
    { id: "n5_csv_15", word: "遅い", reading: "おそい", part: "形一", def: "慢的；晚的", example: "足が遅い。", example_cn: "走得慢。" },
    { id: "n5_csv_16", word: "太い", reading: "ふとい", part: "形一", def: "粗的；胖的", example: "太い足。", example_cn: "粗腿。" },
    { id: "n5_csv_17", word: "細い", reading: "ほそい", part: "形一", def: "細的；瘦的", example: "細い道。", example_cn: "細長的小路。" },
    { id: "n5_131", word: "広い", reading: "ひろい", part: "形一", def: "寬廣的", example: "広い公園。", example_cn: "寬廣的公園。" },
    { id: "n5_132", word: "狭い", reading: "せまい", part: "形一", def: "狹窄的", example: "狭い道。", example_cn: "狹窄的路。" },
    { id: "n5_24", word: "好き", reading: "すき", part: "ナ", def: "喜歡", example: "犬が好きです。", example_cn: "我喜歡狗。" },
    { id: "n5_25", word: "嫌い", reading: "きらい", part: "ナ", def: "討厭", example: "納豆が嫌いです。", example_cn: "我討厭納豆。" },
    { id: "n5_26", word: "上手", reading: "じょうず", part: "ナ", def: "擅長", example: "歌が上手です。", example_cn: "很會唱歌。" },
    { id: "n5_27", word: "下手", reading: "へた", part: "ナ", def: "不擅長", example: "絵が下手です。", example_cn: "畫畫很爛。" },
    { id: "n5_28", word: "暑い", reading: "あつい", part: "形一", def: "熱的(天氣)", example: "夏は暑いです。", example_cn: "夏天很熱。" },
    { id: "n5_29", word: "寒い", reading: "さむい", part: "形一", def: "冷的(天氣)", example: "冬は寒いです。", example_cn: "冬天很冷。" },
    { id: "n5_40", word: "美味しい", reading: "おいしい", part: "形一", def: "好吃的", example: "このラーメンは美味しいです。", example_cn: "這拉麵很好吃。" },
    { id: "n5_41", word: "面白い", reading: "おもしろい", part: "形一", def: "有趣的", example: "面白い映画でした。", example_cn: "是有趣的電影。" },
    { id: "n5_42", word: "楽しい", reading: "たのしい", part: "形一", def: "快樂的", example: "旅行は楽しいです。", example_cn: "旅行很快樂。" },
    { id: "n5_43", word: "難しい", reading: "むずかしい", part: "形一", def: "困難的", example: "日本語は難しいですか。", example_cn: "日文難嗎？" },
    { id: "n5_44", word: "易しい", reading: "やさしい", part: "形一", def: "簡單的；溫柔的", example: "この問題は易しいです。", example_cn: "這個問題很簡單。" },
    { id: "n5_45", word: "忙しい", reading: "いそがしい", part: "形一", def: "忙碌的", example: "今日は忙しいです。", example_cn: "今天很忙。" },
    { id: "n5_121", word: "赤い", reading: "あかい", part: "形一", def: "紅色的", example: "赤いりんご。", example_cn: "紅蘋果。" },
    { id: "n5_122", word: "青い", reading: "あおい", part: "形一", def: "藍色的", example: "青い空。", example_cn: "藍天。" },
    { id: "n5_123", word: "白い", reading: "しろい", part: "形一", def: "白色的", example: "白い雪。", example_cn: "白雪。" },
    { id: "n5_124", word: "黒い", reading: "くろい", part: "形一", def: "黑色的", example: "黒い猫。", example_cn: "黑貓。" },
    { id: "n5_125", word: "良い", reading: "よい", part: "形一", def: "好的", example: "良い天気です。", example_cn: "好天氣。" },
    { id: "n5_126", word: "悪い", reading: "わるい", part: "形一", def: "壞的", example: "天気が悪いです。", example_cn: "天氣不好。" },
    { id: "n5_127", word: "長い", reading: "ながい", part: "形一", def: "長的", example: "髪が長いです。", example_cn: "頭髮很長。" },
    { id: "n5_128", word: "短い", reading: "みじかい", part: "形一", def: "短的", example: "短い鉛筆。", example_cn: "很短的鉛筆。" },
    { id: "n5_129", word: "明るい", reading: "あかるい", part: "形一", def: "明亮的；開朗的", example: "明るい部屋。", example_cn: "明亮的房間。" },
    { id: "n5_130", word: "暗い", reading: "くらい", part: "形一", def: "暗的", example: "外はもう暗いです。", example_cn: "外面已經暗了。" },
    { id: "n5_133", word: "静か", reading: "しずか", part: "ナ", def: "安靜的", example: "図書館は静かです。", example_cn: "圖書館很安靜。" },
    { id: "n5_134", word: "賑やか", reading: "にぎやか", part: "ナ", def: "熱鬧的", example: "お祭りは賑やかです。", example_cn: "祭典很熱鬧。" },
    { id: "n5_135", word: "有名", reading: "ゆうめい", part: "ナ", def: "有名的", example: "有名な歌手。", example_cn: "有名的歌手。" },
    { id: "n5_136", word: "綺麗", reading: "きれい", part: "ナ", def: "漂亮的；乾淨的", example: "綺麗な花。", example_cn: "漂亮的花。" },
    { id: "n5_137", word: "大切", reading: "たいせつ", part: "ナ", def: "重要的；珍惜的", example: "大切な友達。", example_cn: "重要的朋友。" },
    { id: "n5_138", word: "大丈夫", reading: "だいじょうぶ", part: "ナ", def: "沒問題的", example: "時間は大丈夫ですか。", example_cn: "時間沒問題嗎？" },

    // --- 飲食 ---
    { id: "n5_2", word: "食べる", reading: "たべる", part: "動二", def: "吃", example: "朝ご飯を食べます。", example_cn: "吃早餐。" },
    { id: "n5_20", word: "水", reading: "みず", part: "名", def: "水", example: "水をください。", example_cn: "請給我水。" },
    { id: "n5_31", word: "飲む", reading: "のむ", part: "動一", def: "喝", example: "コーヒーを飲みます。", example_cn: "喝咖啡。" },
    { id: "n5_56", word: "ご飯", reading: "ごはん", part: "名", def: "飯；餐點", example: "ご飯を食べます。", example_cn: "吃飯。" },
    { id: "n5_57", word: "パン", reading: "パン", part: "名", def: "麵包", example: "朝はパンを食べます。", example_cn: "早上吃麵包。" },
    { id: "n5_58", word: "魚", reading: "さかな", part: "名", def: "魚", example: "魚が好きです。", example_cn: "我喜歡魚。" },
    { id: "n5_59", word: "肉", reading: "にく", part: "名", def: "肉", example: "肉料理。", example_cn: "肉類料理。" },
    { id: "n5_80", word: "お茶", reading: "おちゃ", part: "名", def: "茶", example: "お茶を飲みますか。", example_cn: "要喝茶嗎？" },
    { id: "n5_81", word: "牛乳", reading: "ぎゅうにゅう", part: "名", def: "牛奶", example: "牛乳を買います。", example_cn: "買牛奶。" },
    { id: "n5_82", word: "果物", reading: "くだもの", part: "名", def: "水果", example: "果物が好きです。", example_cn: "我喜歡水果。" },
    { id: "n5_83", word: "野菜", reading: "やさい", part: "名", def: "蔬菜", example: "野菜を食べましょう。", example_cn: "吃蔬菜吧。" },
    { id: "n5_84", word: "卵", reading: "たまご", part: "名", def: "雞蛋", example: "卵料理。", example_cn: "蛋料理。" },
    { id: "n5_85", word: "朝ご飯", reading: "あさごはん", part: "名", def: "早餐", example: "朝ご飯はパンです。", example_cn: "早餐是麵包。" },
    { id: "n5_86", word: "昼ご飯", reading: "ひるごはん", part: "名", def: "午餐", example: "昼ご飯を食べに行こう。", example_cn: "去吃午餐吧。" },
    { id: "n5_87", word: "晩ご飯", reading: "ばんごはん", part: "名", def: "晚餐", example: "晩ご飯を作ります。", example_cn: "做晚餐。" },
    { id: "n5_88", word: "喫茶店", reading: "きっさてん", part: "名", def: "咖啡廳", example: "喫茶店で休みます。", example_cn: "在咖啡廳休息。" },
    { id: "n5_89", word: "レストラン", reading: "レストラン", part: "名", def: "餐廳", example: "レストランで食事する。", example_cn: "在餐廳吃飯。" },

    // --- 時間與方位 ---
    { id: "n5_14", word: "今日", reading: "きょう", part: "名", def: "今天", example: "今日は暑いです。", example_cn: "今天很熱。" },
    { id: "n5_15", word: "明日", reading: "あした", part: "名", def: "明天", example: "明日は雨でしょう。", example_cn: "明天大概會下雨吧。" },
    { id: "n5_16", word: "昨日", reading: "きのう", part: "名", def: "昨天", example: "昨日は楽しかったです。", example_cn: "昨天很開心。" },
    { id: "n5_65", word: "今", reading: "いま", part: "名", def: "現在", example: "今、何時ですか。", example_cn: "現在幾點？" },
    { id: "n5_66", word: "毎日", reading: "まいにち", part: "名", def: "每天", example: "毎日勉強します。", example_cn: "每天唸書。" },
    { id: "n5_69", word: "右", reading: "みぎ", part: "名", def: "右邊", example: "右を見てください。", example_cn: "請看右邊。" },
    { id: "n5_70", word: "左", reading: "ひだり", part: "名", def: "左邊", example: "左に曲がります。", example_cn: "向左轉。" },
    { id: "n5_90", word: "上", reading: "うえ", part: "名", def: "上面", example: "机の上に本があります。", example_cn: "桌上有書。" },
    { id: "n5_91", word: "下", reading: "した", part: "名", def: "下面", example: "椅子の下に猫がいます。", example_cn: "椅子下有貓。" },
    { id: "n5_92", word: "前", reading: "まえ", part: "名", def: "前面", example: "駅の前にいます。", example_cn: "在車站前面。" },
    { id: "n5_93", word: "後ろ", reading: "うしろ", part: "名", def: "後面", example: "後ろを見て。", example_cn: "看後面。" },
    { id: "n5_94", word: "中", reading: "なか", part: "名", def: "裡面", example: "部屋の中にいます。", example_cn: "在房間裡。" },
    { id: "n5_95", word: "外", reading: "そと", part: "名", def: "外面", example: "外は寒いです。", example_cn: "外面很冷。" },
    { id: "n5_96", word: "朝", reading: "あさ", part: "名", def: "早上", example: "朝早く起きます。", example_cn: "很早起床。" },
    { id: "n5_97", word: "昼", reading: "ひる", part: "名", def: "中午；白天", example: "昼まで寝ていました。", example_cn: "睡到了中午。" },
    { id: "n5_98", word: "晩", reading: "ばん", part: "名", def: "晚上", example: "晩ご飯。", example_cn: "晚餐。" },
    { id: "n5_99", word: "夜", reading: "よる", part: "名", def: "夜晚", example: "夜は静かです。", example_cn: "夜晚很安靜。" },
    { id: "n5_100", word: "来年", reading: "らいねん", part: "名", def: "明年", example: "来年日本へ行きます。", example_cn: "明年要去日本。" },
    { id: "n5_101", word: "去年", reading: "きょねん", part: "名", def: "去年", example: "去年卒業しました。", example_cn: "去年畢業了。" },
    { id: "n5_102", word: "今週", reading: "こんしゅう", part: "名", def: "這週", example: "今週は忙しいです。", example_cn: "這週很忙。" },
    { id: "n5_103", word: "来週", reading: "らいしゅう", part: "名", def: "下週", example: "来週テストがあります。", example_cn: "下週有考試。" },

    // --- 生活名詞 ---
    { id: "n5_21", word: "電話", reading: "でんわ", part: "名", def: "電話", example: "電話をかけます。", example_cn: "打電話。" },
    { id: "n5_22", word: "時間", reading: "じかん", part: "名", def: "時間", example: "時間がありません。", example_cn: "沒有時間。" },
    { id: "n5_60", word: "学校", reading: "がっこう", part: "名", def: "學校", example: "学校へ行きます。", example_cn: "去學校。" },
    { id: "n5_61", word: "家", reading: "いえ", part: "名", def: "家；房子", example: "大きい家です。", example_cn: "很大的房子。" },
    { id: "n5_62", word: "部屋", reading: "へや", part: "名", def: "房間", example: "私の部屋です。", example_cn: "這是我的房間。" },
    { id: "n5_63", word: "雨", reading: "あめ", part: "名", def: "雨", example: "雨が降っています。", example_cn: "正在下雨。" },
    { id: "n5_64", word: "花", reading: "はな", part: "名", def: "花", example: "綺麗な花です。", example_cn: "漂亮的花。" },
    { id: "n5_68", word: "名前", reading: "なまえ", part: "名", def: "名字", example: "名前を教えてください。", example_cn: "請告訴我名字。" },
    { id: "n5_104", word: "お金", reading: "おかね", part: "名", def: "錢", example: "お金が足りません。", example_cn: "錢不夠。" },
    { id: "n5_105", word: "切符", reading: "きっぷ", part: "名", def: "車票", example: "切符を買います。", example_cn: "買車票。" },
    { id: "n5_106", word: "写真", reading: "しゃしん", part: "名", def: "照片", example: "写真を撮りましょう。", example_cn: "來拍照吧。" },
    { id: "n5_107", word: "手紙", reading: "てがみ", part: "名", def: "信", example: "手紙を書きます。", example_cn: "寫信。" },
    { id: "n5_108", word: "眼鏡", reading: "めがね", part: "名", def: "眼鏡", example: "眼鏡をかけます。", example_cn: "戴眼鏡。" },
    { id: "n5_109", word: "服", reading: "ふく", part: "名", def: "衣服", example: "服を着ます。", example_cn: "穿衣服。" },
    { id: "n5_110", word: "本", reading: "ほん", part: "名", def: "書", example: "本を読みます。", example_cn: "讀書。" },
    { id: "n5_111", word: "辞書", reading: "じしょ", part: "名", def: "字典", example: "辞書で調べます。", example_cn: "用字典查。" },
    { id: "n5_112", word: "自転車", reading: "じてんしゃ", part: "名", def: "腳踏車", example: "自転車に乗ります。", example_cn: "騎腳踏車。" },
    { id: "n5_113", word: "自動車", reading: "じどうしゃ", part: "名", def: "汽車", example: "自動車を運転する。", example_cn: "開車。" },
    { id: "n5_114", word: "電車", reading: "でんしゃ", part: "名", def: "電車", example: "電車で通勤する。", example_cn: "搭電車通勤。" },
    { id: "n5_115", word: "飛行機", reading: "ひこうき", part: "名", def: "飛機", example: "飛行機が飛びます。", example_cn: "飛機飛了。" },
    { id: "n5_116", word: "駅", reading: "えき", part: "名", def: "車站", example: "駅まで歩きます。", example_cn: "走到車站。" },
    { id: "n5_117", word: "病院", reading: "びょういん", part: "名", def: "醫院", example: "病院へ行きます。", example_cn: "去醫院。" },
    { id: "n5_118", word: "銀行", reading: "ぎんこう", part: "名", def: "銀行", example: "銀行でお金を下ろす。", example_cn: "去銀行領錢。" },
    { id: "n5_119", word: "郵便局", reading: "ゆうびんきょく", part: "名", def: "郵局", example: "郵便局はどこですか。", example_cn: "郵局在哪裡？" },
    { id: "n5_120", word: "図書館", reading: "としょかん", part: "名", def: "圖書館", example: "図書館で勉強します。", example_cn: "在圖書館唸書。" },

    // --- 動詞 ---
    { id: "n5_5", word: "行く", reading: "いく", part: "動一", def: "去", example: "学校へ行きます。", example_cn: "去學校。" },
    { id: "n5_8", word: "勉強", reading: "べんきょう", part: "名/他サ", def: "學習", example: "日本語を勉強します。", example_cn: "學習日語。" },
    { id: "n5_10", word: "見る", reading: "みる", part: "動二", def: "看", example: "映画を見ます。", example_cn: "看電影。" },
    { id: "n5_11", word: "聞く", reading: "きく", part: "動一", def: "聽；問", example: "音楽を聞きます。", example_cn: "聽音樂。" },
    { id: "n5_17", word: "書く", reading: "かく", part: "動一", def: "寫", example: "名前を書いてください。", example_cn: "請寫下名字。" },
    { id: "n5_18", word: "読む", reading: "よむ", part: "動一", def: "讀", example: "本を読みます。", example_cn: "讀書。" },
    { id: "n5_19", word: "話す", reading: "はなす", part: "動一", def: "說話", example: "日本語を話します。", example_cn: "說日語。" },
    { id: "n5_32", word: "会う", reading: "あう", part: "動一", def: "見面", example: "友達に会います。", example_cn: "見朋友。" },
    { id: "n5_33", word: "買う", reading: "かう", part: "動一", def: "買", example: "新しい靴を買います。", example_cn: "買新鞋子。" },
    { id: "n5_34", word: "帰る", reading: "かえる", part: "動一", def: "回家；回去", example: "家に帰ります。", example_cn: "回家。" },
    { id: "n5_35", word: "来る", reading: "くる", part: "動三", def: "來", example: "こちらへ来てください。", example_cn: "請來這邊。" },
    { id: "n5_36", word: "する", reading: "する", part: "動三", def: "做", example: "スポーツをします。", example_cn: "做運動。" },
    { id: "n5_37", word: "寝る", reading: "ねる", part: "動二", def: "睡覺", example: "10時に寝ます。", example_cn: "10點睡覺。" },
    { id: "n5_38", word: "起きる", reading: "おきる", part: "動二", def: "起床", example: "毎朝6時に起きます。", example_cn: "每天早上6點起床。" },
    { id: "n5_139", word: "歩く", reading: "あるく", part: "動一", def: "走路", example: "駅まで歩きます。", example_cn: "走到車站。" },
    { id: "n5_140", word: "走る", reading: "はしる", part: "動一", def: "跑步", example: "廊下を走らないで。", example_cn: "不要在走廊奔跑。" },
    { id: "n5_141", word: "泳ぐ", reading: "およぐ", part: "動一", def: "游泳", example: "海で泳ぎます。", example_cn: "在海裡游泳。" },
    { id: "n5_142", word: "遊ぶ", reading: "あそぶ", part: "動一", def: "玩耍", example: "公園で遊びます。", example_cn: "在公園玩。" },
    { id: "n5_143", word: "待つ", reading: "まつ", part: "動一", def: "等待", example: "ここで待ってください。", example_cn: "請在這裡等。" },
    { id: "n5_144", word: "開ける", reading: "あける", part: "動二", def: "打開", example: "ドアを開けます。", example_cn: "打開門。" },
    { id: "n5_145", word: "閉める", reading: "しめる", part: "動二", def: "關閉", example: "窓を閉めてください。", example_cn: "請關窗戶。" },
    { id: "n5_146", word: "教える", reading: "おしえる", part: "動二", def: "教導；告訴", example: "日本語を教えます。", example_cn: "教日文。" },
    { id: "n5_147", word: "貸す", reading: "かす", part: "動一", def: "借出", example: "ペンを貸してください。", example_cn: "請借我筆。" },
    { id: "n5_148", word: "借りる", reading: "かりる", part: "動二", def: "借入", example: "図書館で本を借ります。", example_cn: "在圖書館借書。" },
    { id: "n5_149", word: "立つ", reading: "たつ", part: "動一", def: "站立", example: "立ってください。", example_cn: "請站起來。" },
    { id: "n5_150", word: "座る", reading: "すわる", part: "動一", def: "坐下", example: "ここに座ってください。", example_cn: "請坐在這裡。" }
  ],
  "N4": [ // 初級：日常對話 (30 words)
    { id: "n4_1", word: "決める", reading: "きめる", part: "他下一", def: "決定", example: "旅行の日程を決めました。", example_cn: "決定了旅行的日程。" },
    { id: "n4_2", word: "住所", reading: "じゅうしょ", part: "名", def: "地址", example: "住所を教えてください。", example_cn: "請告訴我地址。" },
    { id: "n4_3", word: "彼", reading: "かれ", part: "代", def: "他；男朋友", example: "彼はとても親切です。", example_cn: "他非常親切。" },
    { id: "n4_4", word: "特に", reading: "とくに", part: "副", def: "特別是", example: "特に質問はありません。", example_cn: "沒有什麼特別的問題。" },
    { id: "n4_5", word: "下げる", reading: "さげる", part: "他下一", def: "降低；降下", example: "音量を下げてください。", example_cn: "請降低音量。" },
    { id: "n4_6", word: "機会", reading: "きかい", part: "名", def: "機會", example: "いい機会だ。", example_cn: "這是個好機會。" },
    { id: "n4_7", word: "紹介", reading: "しょうかい", part: "名/他サ", def: "介紹", example: "自己紹介をお願いします。", example_cn: "請做自我介紹。" },
    { id: "n4_8", word: "準備", reading: "じゅんび", part: "名/他サ", def: "準備", example: "試験の準備をします。", example_cn: "做考試的準備。" },
    { id: "n4_9", word: "引っ越し", reading: "ひっこし", part: "名/自サ", def: "搬家", example: "来週、引っ越しします。", example_cn: "下週要搬家。" },
    { id: "n4_10", word: "利用", reading: "りよう", part: "名/他サ", def: "利用；使用", example: "バスを利用します。", example_cn: "搭乘公車。" },
    { id: "n4_11", word: "危険", reading: "きけん", part: "ナ/名", def: "危險", example: "ここは危険です。", example_cn: "這裡很危險。" },
    { id: "n4_12", word: "安全", reading: "あんぜん", part: "ナ/名", def: "安全", example: "安全を確認する。", example_cn: "確認安全。" },
    { id: "n4_13", word: "故障", reading: "こしょう", part: "名/自サ", def: "故障", example: "車が故障しました。", example_cn: "車子故障了。" },
    { id: "n4_14", word: "直す", reading: "なおす", part: "他一", def: "修理；訂正", example: "時計を直します。", example_cn: "修理時鐘。" },
    { id: "n4_15", word: "集める", reading: "あつめる", part: "他下一", def: "收集；集合", example: "切手を集めています。", example_cn: "正在收集郵票。" },
    { id: "n4_16", word: "予定", reading: "よてい", part: "名", def: "預定；計畫", example: "予定を確認します。", example_cn: "確認行程。" },
    { id: "n4_17", word: "理由", reading: "りゆう", part: "名", def: "理由", example: "遅刻の理由を言う。", example_cn: "說明遲到的理由。" },
    { id: "n4_18", word: "反対", reading: "はんたい", part: "名/自サ", def: "反對；相反", example: "その意見に反対です。", example_cn: "反對那個意見。" },
    { id: "n4_19", word: "賛成", reading: "さんせい", part: "名/自サ", def: "贊成", example: "私は賛成です。", example_cn: "我贊成。" },
    { id: "n4_20", word: "役に立つ", reading: "やくにたつ", part: "慣", def: "有用；有幫助", example: "この本は役に立ちます。", example_cn: "這本書很有用。" },
    { id: "n4_21", word: "全然", reading: "ぜんぜん", part: "副", def: "完全(不)", example: "全然わかりません。", example_cn: "完全聽不懂。" },
    { id: "n4_22", word: "大体", reading: "だいたい", part: "副/名", def: "大致；大概", example: "大体終わりました。", example_cn: "大概做完了。" },
    { id: "n4_23", word: "場合", reading: "ばあい", part: "名", def: "場合；情況", example: "火事の場合は逃げてください。", example_cn: "發生火災的情況請逃生。" },
    { id: "n4_24", word: "不便", reading: "ふべん", part: "ナ/名", def: "不便", example: "交通が不便です。", example_cn: "交通不便。" },
    { id: "n4_25", word: "便利", reading: "べんり", part: "ナ/名", def: "方便", example: "スマホは便利です。", example_cn: "智慧型手機很方便。" },
    { id: "n4_26", word: "経済", reading: "けいざい", part: "名", def: "經濟", example: "経済のニュースを見る。", example_cn: "看經濟新聞。" },
    { id: "n4_27", word: "政治", reading: "せいじ", part: "名", def: "政治", example: "政治に関心がある。", example_cn: "對政治感興趣。" },
    { id: "n4_28", word: "文化", reading: "ぶんか", part: "名", def: "文化", example: "日本の文化を学ぶ。", example_cn: "學習日本文化。" },
    { id: "n4_29", word: "法律", reading: "ほうりつ", part: "名", def: "法律", example: "法律を守る。", example_cn: "遵守法律。" },
    { id: "n4_30", word: "教育", reading: "きょういく", part: "名/他サ", def: "教育", example: "子供の教育について考える。", example_cn: "思考關於孩子的教育。" }
  ],
  "N3": [ // 中級：日常應用 (30 words)
    { id: "n3_1", word: "我慢", reading: "がまん", part: "名/他サ", def: "忍耐", example: "痛いのを我慢する。", example_cn: "忍住疼痛。" },
    { id: "n3_2", word: "当然", reading: "とうぜん", part: "副/ナ", def: "當然；理所當然", example: "彼が怒るのも当然だ。", example_cn: "他會生氣也是理所當然的。" },
    { id: "n3_3", word: "募集", reading: "ぼしゅう", part: "名/他サ", def: "招募", example: "アルバイトを募集している。", example_cn: "正在招募工讀生。" },
    { id: "n3_4", word: "優勝", reading: "ゆうしょう", part: "名/自サ", def: "冠軍；優勝", example: "チームが優勝しました。", example_cn: "隊伍獲得了冠軍。" },
    { id: "n3_5", word: "濃い", reading: "こい", part: "形一", def: "濃的；深色的", example: "味が濃い料理が好きだ。", example_cn: "喜歡口味重的料理。" },
    { id: "n3_6", word: "感想", reading: "かんそう", part: "名", def: "感想", example: "読書感想文を書く。", example_cn: "寫讀書心得。" },
    { id: "n3_7", word: "理解", reading: "りかい", part: "名/他サ", def: "理解", example: "内容を理解しました。", example_cn: "理解了內容。" },
    { id: "n3_8", word: "協力", reading: "きょうりょく", part: "名/自サ", def: "合作；協助", example: "皆で協力して働く。", example_cn: "大家通力合作工作。" },
    { id: "n3_9", word: "参加", reading: "さんか", part: "名/自サ", def: "參加", example: "会議に参加する。", example_cn: "參加會議。" },
    { id: "n3_10", word: "期待", reading: "きたい", part: "名/他サ", def: "期待", example: "活躍を期待しています。", example_cn: "期待您的活躍表現。" },
    { id: "n3_11", word: "消費", reading: "しょうひ", part: "名/他サ", def: "消費；消耗", example: "エネルギーを消費する。", example_cn: "消耗能量。" },
    { id: "n3_12", word: "勇気", reading: "ゆうき", part: "名", def: "勇氣", example: "勇気を出して告白する。", example_cn: "鼓起勇氣告白。" },
    { id: "n3_13", word: "現実", reading: "げんじつ", part: "名", def: "現實", example: "現実は厳しい。", example_cn: "現實是殘酷的。" },
    { id: "n3_14", word: "環境", reading: "かんきょう", part: "名", def: "環境", example: "環境を守る。", example_cn: "保護環境。" },
    { id: "n3_15", word: "自然", reading: "しぜん", part: "名", def: "自然", example: "豊かな自然。", example_cn: "豐富的大自然。" },
    { id: "n3_16", word: "区別", reading: "くべつ", part: "名/他サ", def: "區別", example: "善悪の区別をつける。", example_cn: "區分善惡。" },
    { id: "n3_17", word: "差別", reading: "さべつ", part: "名/他サ", def: "歧視；差別待遇", example: "差別はいけない。", example_cn: "不可以歧視。" },
    { id: "n3_18", word: "平均", reading: "へいきん", part: "名/他サ", def: "平均", example: "平均点を計算する。", example_cn: "計算平均分數。" },
    { id: "n3_19", word: "評価", reading: "ひょうか", part: "名/他サ", def: "評價", example: "高く評価される。", example_cn: "受到高度評價。" },
    { id: "n3_20", word: "表現", reading: "ひょうげん", part: "名/他サ", def: "表現；表達", example: "感謝の気持ちを表現する。", example_cn: "表達感謝的心情。" },
    { id: "n3_21", word: "表面", reading: "ひょうめん", part: "名", def: "表面", example: "水の表面。", example_cn: "水的表面。" },
    { id: "n3_22", word: "瓶", reading: "びん", part: "名", def: "瓶子", example: "空き瓶を捨てる。", example_cn: "丟棄空瓶。" },
    { id: "n3_23", word: "不満", reading: "ふまん", part: "名/ナ", def: "不滿", example: "現状に不満がある。", example_cn: "對現狀感到不滿。" },
    { id: "n3_24", word: "不思議", reading: "ふしぎ", part: "ナ/名", def: "不可思議；奇怪", example: "不思議な体験をした。", example_cn: "有了不可思議的體驗。" },
    { id: "n3_25", word: "普段", reading: "ふだん", part: "名/副", def: "平時；平常", example: "普段着で出かける。", example_cn: "穿著便服出門。" },
    { id: "n3_26", word: "平和", reading: "へいわ", part: "ナ/名", def: "和平", example: "世界平和を祈る。", example_cn: "祈求世界和平。" },
    { id: "n3_27", word: "変化", reading: "へんか", part: "名/自サ", def: "變化", example: "気候の変化。", example_cn: "氣候的變化。" },
    { id: "n3_28", word: "方向", reading: "ほうこう", part: "名", def: "方向", example: "正しい方向に進む。", example_cn: "朝正確的方向前進。" },
    { id: "n3_29", word: "報告", reading: "ほうこく", part: "名/他サ", def: "報告", example: "上司に報告する。", example_cn: "向報告上司。" },
    { id: "n3_30", word: "方法", reading: "ほうほう", part: "名", def: "方法", example: "解決する方法を探す。", example_cn: "尋找解決的方法。" }
  ],
  "N2": [ // 中高級：商務/一般 (30 words)
    { id: "n2_1", word: "検討", reading: "けんとう", part: "名/他サ", def: "討論；研究", example: "その件は検討中です。", example_cn: "那件事正在討論中。" },
    { id: "n2_2", word: "契約", reading: "けいやく", part: "名/他サ", def: "合約", example: "契約を結びました。", example_cn: "簽訂了合約。" },
    { id: "n2_3", word: "依頼", reading: "いらい", part: "名/他サ", def: "委託；請求", example: "仕事の依頼が来ました。", example_cn: "工作的委託來了。" },
    { id: "n2_4", word: "特徴", reading: "とくちょう", part: "名", def: "特徵；特色", example: "新製品の最大の特徴。", example_cn: "新產品最大的特色。" },
    { id: "n2_5", word: "提供", reading: "ていきょう", part: "名/他サ", def: "提供", example: "情報を提供します。", example_cn: "提供資訊。" },
    { id: "n2_6", word: "影響", reading: "えいきょう", part: "名/自サ", def: "影響", example: "台風の影響で電車が止まった。", example_cn: "受颱風影響電車停駛了。" },
    { id: "n2_7", word: "対策", reading: "たいさく", part: "名", def: "對策；措施", example: "温暖化対策。", example_cn: "暖化對策。" },
    { id: "n2_8", word: "構成", reading: "こうせい", part: "名/他サ", def: "構成；結構", example: "家族構成。", example_cn: "家庭結構。" },
    { id: "n2_9", word: "機能", reading: "きのう", part: "名/自サ", def: "機能；功能", example: "最新の機能を搭載する。", example_cn: "搭載最新功能。" },
    { id: "n2_10", word: "素材", reading: "そざい", part: "名", def: "素材；原料", example: "素材の味を生かす。", example_cn: "發揮食材的原味。" },
    { id: "n2_11", word: "要素", reading: "ようそ", part: "名", def: "要素；因素", example: "成功の要素。", example_cn: "成功的要素。" },
    { id: "n2_12", word: "背景", reading: "はいけい", part: "名", def: "背景", example: "事件の背景を調べる。", example_cn: "調查事件的背景。" },
    { id: "n2_13", word: "分析", reading: "ぶんせき", part: "名/他サ", def: "分析", example: "データを分析する。", example_cn: "分析數據。" },
    { id: "n2_14", word: "管理", reading: "かんり", part: "名/他サ", def: "管理", example: "健康管理に気をつける。", example_cn: "注意健康管理。" },
    { id: "n2_15", word: "判断", reading: "はんだん", part: "名/他サ", def: "判斷", example: "状況を判断する。", example_cn: "判斷狀況。" },
    { id: "n2_16", word: "議論", reading: "ぎろん", part: "名/他サ", def: "議論；討論", example: "活発に議論する。", example_cn: "熱烈地討論。" },
    { id: "n2_17", word: "結論", reading: "けつろん", part: "名", def: "結論", example: "結論を出す。", example_cn: "做出結論。" },
    { id: "n2_18", word: "制限", reading: "せいげん", part: "名/他サ", def: "限制", example: "時間制限がある。", example_cn: "有時間限制。" },
    { id: "n2_19", word: "制度", reading: "せいど", part: "名", def: "制度", example: "新しい制度を導入する。", example_cn: "導入新制度。" },
    { id: "n2_20", word: "製造", reading: "せいぞう", part: "名/他サ", def: "製造", example: "部品を製造する工場。", example_cn: "製造零件的工廠。" },
    { id: "n2_21", word: "成長", reading: "せいちょう", part: "名/自サ", def: "成長", example: "子供の成長は早い。", example_cn: "孩子的成長很快。" },
    { id: "n2_22", word: "責任", reading: "せきにん", part: "名", def: "責任", example: "責任を取る。", example_cn: "負起責任。" },
    { id: "n2_23", word: "積極的", reading: "せっきょくてき", part: "ナ", def: "積極的", example: "積極的に発言する。", example_cn: "積極發言。" },
    { id: "n2_24", word: "組織", reading: "そしき", part: "名/他サ", def: "組織", example: "会社組織。", example_cn: "公司組織。" },
    { id: "n2_25", word: "態度", reading: "たいど", part: "名", def: "態度", example: "態度が悪い。", example_cn: "態度很差。" },
    { id: "n2_26", word: "代表", reading: "だいひょう", part: "名/他サ", def: "代表", example: "日本を代表する作家。", example_cn: "代表日本的作家。" },
    { id: "n2_27", word: "立場", reading: "たちば", part: "名", def: "立場", example: "苦しい立場。", example_cn: "痛苦的立場。" },
    { id: "n2_28", word: "地域", reading: "ちいき", part: "名", def: "地區；區域", example: "この地域の特産物。", example_cn: "這個地區的特產。" },
    { id: "n2_29", word: "知恵", reading: "ちえ", part: "名", def: "智慧", example: "生活の知恵。", example_cn: "生活的智慧。" },
    { id: "n2_30", word: "注目", reading: "ちゅうもく", part: "名/自サ", def: "注目；關注", example: "世界が注目している。", example_cn: "受到世界關注。" }
  ],
  "N1": [ // 高級：抽象/新聞 (30 words)
    { id: "n1_1", word: "妥協", reading: "だきょう", part: "名/自サ", def: "妥協", example: "安易に妥協してはいけない。", example_cn: "不能輕易妥協。" },
    { id: "n1_2", word: "迅速", reading: "じんそく", part: "ナ", def: "迅速", example: "迅速な対応を求める。", example_cn: "尋求迅速的應對。" },
    { id: "n1_3", word: "把握", reading: "はあく", part: "名/他サ", def: "掌握；理解", example: "事態を正確に把握する。", example_cn: "準確地掌握事態。" },
    { id: "n1_4", word: "懸念", reading: "けねん", part: "名/他サ", def: "擔憂；掛念", example: "影響が懸念される。", example_cn: "令人擔憂其影響。" },
    { id: "n1_5", word: "撤回", reading: "てっかい", part: "名/他サ", def: "撤回；撤銷", example: "前言を撤回する。", example_cn: "撤回前言。" },
    { id: "n1_6", word: "圧倒", reading: "あっとう", part: "名/他サ", def: "壓倒；勝過", example: "圧倒的な力を見せつける。", example_cn: "展現壓倒性的力量。" },
    { id: "n1_7", word: "公衆", reading: "こうしゅう", part: "名", def: "公眾；大眾", example: "公衆電話。", example_cn: "公共電話。" },
    { id: "n1_8", word: "見解", reading: "けんかい", part: "名", def: "見解；看法", example: "政府の見解を発表する。", example_cn: "發表政府的見解。" },
    { id: "n1_9", word: "規範", reading: "きはん", part: "名", def: "規範", example: "社会の規範に従う。", example_cn: "遵守社會規範。" },
    { id: "n1_10", word: "促進", reading: "そくしん", part: "名/他サ", def: "促進", example: "販売を促進する。", example_cn: "促進銷售。" },
    { id: "n1_11", word: "廃止", reading: "はいし", part: "名/他サ", def: "廢止", example: "制度を廃止する。", example_cn: "廢止制度。" },
    { id: "n1_12", word: "権限", reading: "けんげん", part: "名", def: "權限", example: "権限の範囲内。", example_cn: "權限範圍內。" },
    { id: "n1_13", word: "示唆", reading: "しさ", part: "名/他サ", def: "暗示；啟發", example: "解決策を示唆する。", example_cn: "暗示解決方案。" },
    { id: "n1_14", word: "動向", reading: "どうこう", part: "名", def: "動向；趨勢", example: "市場の動向を探る。", example_cn: "探尋市場的趨勢。" },
    { id: "n1_15", word: "画期的", reading: "かっきてき", part: "ナ", def: "劃時代的", example: "画期的な発明。", example_cn: "劃時代的發明。" },
    { id: "n1_16", word: "頑固", reading: "がんこ", part: "ナ/名", def: "頑固", example: "頑固な職人。", example_cn: "頑固的工匠。" },
    { id: "n1_17", word: "緩和", reading: "かんわ", part: "名/他サ", def: "緩和；放寬", example: "規制を緩和する。", example_cn: "放寬限制。" },
    { id: "n1_18", word: "還元", reading: "かんげん", part: "名/他サ", def: "還原；回饋", example: "利益を社会に還元する。", example_cn: "將利益回饋社會。" },
    { id: "n1_19", word: "棄権", reading: "きけん", part: "名/他サ", def: "棄權", example: "投票を棄権する。", example_cn: "放棄投票。" },
    { id: "n1_20", word: "強行", reading: "きょうこう", part: "名/他サ", def: "強行", example: "採決を強行する。", example_cn: "強行表決。" },
    { id: "n1_21", word: "均衡", reading: "きんこう", part: "名/自サ", def: "均衡；平衡", example: "力の均衡を保つ。", example_cn: "保持力量均衡。" },
    { id: "n1_22", word: "吟味", reading: "ぎんみ", part: "名/他サ", def: "斟酌；玩味", example: "材料をよく吟味する。", example_cn: "仔細挑選材料。" },
    { id: "n1_23", word: "経緯", reading: "けいい", part: "名", def: "原委；經過", example: "事件の経緯を説明する。", example_cn: "說明事件的原委。" },
    { id: "n1_24", word: "欠陥", reading: "けっかん", part: "名", def: "缺陷", example: "構造上の欠陥。", example_cn: "構造上的缺陷。" },
    { id: "n1_25", word: "牽制", reading: "けんせい", part: "名/他サ", def: "牽制", example: "相手を牽制する。", example_cn: "牽制對手。" },
    { id: "n1_26", word: "顕著", reading: "けんちょ", part: "ナ", def: "顯著", example: "顕著な効果が現れる。", example_cn: "出現顯著的效果。" },
    { id: "n1_27", word: "合意", reading: "ごうい", part: "名/自サ", def: "同意；達成協議", example: "双方の合意に達する。", example_cn: "達成雙方協議。" },
    { id: "n1_28", word: "巧妙", reading: "こうみょう", part: "ナ", def: "巧妙", example: "巧妙な手口。", example_cn: "巧妙的手法。" },
    { id: "n1_29", word: "誇張", reading: "こちょう", part: "名/他サ", def: "誇張", example: "事実を誇張して話す。", example_cn: "誇大事實來說。" },
    { id: "n1_30", word: "根拠", reading: "こんきょ", part: "名", def: "根據", example: "科学的な根拠。", example_cn: "科學根據。" }
  ]
};

// -----------------------------------------------------------------------------
// 遊戲化等級設定
// -----------------------------------------------------------------------------
const USER_RANKS = [
  { min: 0, name: "日語見習", color: "text-slate-500", bg: "bg-slate-100", border: "border-slate-200", icon: "🌱" },
  { min: 5, name: "努力家", color: "text-sky-500", bg: "bg-sky-100", border: "border-sky-200", icon: "🖊️" },
  { min: 15, name: "達人", color: "text-violet-500", bg: "bg-violet-100", border: "border-violet-200", icon: "🎓" },
  { min: 30, name: "大師", color: "text-amber-500", bg: "bg-amber-100", border: "border-amber-200", icon: "👑" }
];

const BADGES_DATA = [
  { id: 'first_step', name: '始動', desc: '完成第一次學習', icon: <Award size={24} />, color: 'bg-emerald-400' },
  { id: 'n5_master', name: 'N5 制霸', desc: '學完所有 N5 單字', icon: <Trophy size={24} />, color: 'bg-blue-400' },
  { id: 'kana_master', name: '五十音大師', desc: '五十音測驗滿分', icon: <Grid size={24} />, color: 'bg-pink-400' },
  { id: 'streak_3', name: '三日坊主克服', desc: '連續學習 3 天', icon: <Flame size={24} />, color: 'bg-rose-400' },
];

// -----------------------------------------------------------------------------
// 工具函數：音效
// -----------------------------------------------------------------------------
const playSound = (type) => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(660, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.2, ctx.currentTime); 
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(); osc.stop(ctx.currentTime + 0.4);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(); osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'success') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.15, ctx.currentTime + i*0.1);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i*0.1 + 0.5);
        o.start(ctx.currentTime + i*0.1); o.stop(ctx.currentTime + i*0.1 + 0.5);
      });
    }
  } catch (e) { console.error(e); }
};

// -----------------------------------------------------------------------------
// 主應用程式
// -----------------------------------------------------------------------------
export default function App() {
  const [view, setView] = useState('home'); 
  const [currentCategory, setCurrentCategory] = useState('N5'); 
  const [kanaTab, setKanaTab] = useState('hira'); 

  // 學習紀錄
  const [learnedWords, setLearnedWords] = useState([]);
  const [wrongWords, setWrongWords] = useState([]); 
  const [wrongKana, setWrongKana] = useState([]); // 新增：五十音錯題
  const [badges, setBadges] = useState([]);
  
  // 測驗 Session 狀態
  const [dailyBatch, setDailyBatch] = useState([]);
  const [quizModes, setQuizModes] = useState([]);
  const [sessionWrongIds, setSessionWrongIds] = useState([]); 
  const [isReviewMode, setIsReviewMode] = useState(false); 
  const [isLoopingReview, setIsLoopingReview] = useState(false); 
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streak, setStreak] = useState(0);
  const [newUnlock, setNewUnlock] = useState(null);

  // 語音設定狀態
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState('');

  // 初始化
  useEffect(() => {
    const savedLearned = JSON.parse(localStorage.getItem('jp_multi_learned')) || [];
    const savedWrong = JSON.parse(localStorage.getItem('jp_multi_wrong')) || [];
    const savedWrongKana = JSON.parse(localStorage.getItem('jp_multi_wrong_kana')) || [];
    const savedBadges = JSON.parse(localStorage.getItem('jp_multi_badges')) || [];
    const savedStreak = parseInt(localStorage.getItem('jp_multi_streak')) || 0;
    const lastLogin = localStorage.getItem('jp_multi_last_login');
    const savedCategory = localStorage.getItem('jp_multi_category') || 'N5';
    const savedVoiceURI = localStorage.getItem('jp_multi_voice_uri') || '';
    
    setLearnedWords(savedLearned);
    setWrongWords(savedWrong);
    setWrongKana(savedWrongKana);
    setBadges(savedBadges);
    setCurrentCategory(savedCategory);
    setSelectedVoiceURI(savedVoiceURI);

    const today = new Date().toDateString();
    if (lastLogin !== today) {
      if (lastLogin) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastLogin === yesterday.toDateString()) {
          setStreak(savedStreak);
        } else {
          setStreak(0);
        }
      }
      localStorage.setItem('jp_multi_last_login', today);
    } else {
      setStreak(savedStreak);
    }
  }, []);

  // 載入語音列表
  useEffect(() => {
    const loadVoices = () => {
      const allVoices = window.speechSynthesis.getVoices();
      const jaVoices = allVoices.filter(v => v.lang.includes('ja') || v.lang.includes('JP'));
      setVoices(jaVoices);
      const savedVoiceURI = localStorage.getItem('jp_multi_voice_uri');
      
      if (!savedVoiceURI && jaVoices.length > 0) {
        const preferredVoice = jaVoices.find(v => v.name.includes('Google')) || 
                               jaVoices.find(v => v.name.includes('Kyoko')) || 
                               jaVoices.find(v => v.name.includes('Haruka')) || 
                               jaVoices[0];
        setSelectedVoiceURI(preferredVoice.voiceURI);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  useEffect(() => { localStorage.setItem('jp_multi_learned', JSON.stringify(learnedWords)); }, [learnedWords]);
  useEffect(() => { localStorage.setItem('jp_multi_wrong', JSON.stringify(wrongWords)); }, [wrongWords]);
  useEffect(() => { localStorage.setItem('jp_multi_wrong_kana', JSON.stringify(wrongKana)); }, [wrongKana]);
  useEffect(() => { localStorage.setItem('jp_multi_streak', streak); }, [streak]);
  useEffect(() => { localStorage.setItem('jp_multi_badges', JSON.stringify(badges)); }, [badges]);
  useEffect(() => { localStorage.setItem('jp_multi_category', currentCategory); }, [currentCategory]);
  useEffect(() => { localStorage.setItem('jp_multi_voice_uri', selectedVoiceURI); }, [selectedVoiceURI]);

  useEffect(() => {
    if ((view === 'quiz' || view === 'kana_quiz') && dailyBatch.length > 0 && currentIndex >= dailyBatch.length && sessionWrongIds.length === 0) {
      setTimeout(() => playSound('success'), 300);
    }
  }, [view, currentIndex, dailyBatch.length, sessionWrongIds.length]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ja-JP';
      utterance.rate = 0.85;

      if (selectedVoiceURI && voices.length > 0) {
        const voice = voices.find(v => v.voiceURI === selectedVoiceURI);
        if (voice) {
          utterance.voice = voice;
        }
      } else if (voices.length > 0) {
        utterance.voice = voices[0];
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const getCurrentRank = () => {
    const count = learnedWords.length;
    return [...USER_RANKS].reverse().find(l => count >= l.min) || USER_RANKS[0];
  };

  const generateModes = (count) => {
    return Array(count).fill(null).map(() => Math.random() < 0.5 ? 'standard' : 'listening');
  };

  // 開始單字學習
  const startDailySession = () => {
    const categoryData = JLPT_DATA[currentCategory];
    const unlearned = categoryData.filter(w => !learnedWords.includes(w.id));
    
    if (unlearned.length === 0) { 
       const shuffled = [...categoryData].sort(() => 0.5 - Math.random());
       const batch = shuffled.slice(0, 5);
       setDailyBatch(batch);
       setQuizModes(generateModes(batch.length));
       setIsReviewMode(true); 
       setIsLoopingReview(false);
       setSessionWrongIds([]); 
       setCurrentIndex(0);
       setIsFlipped(false);
       setView('learn');
      return; 
    }
    
    const shuffled = [...unlearned].sort(() => 0.5 - Math.random());
    const batch = shuffled.slice(0, 5); 
    
    setDailyBatch(batch);
    setQuizModes(generateModes(batch.length));
    setIsReviewMode(false);
    setIsLoopingReview(false);
    setSessionWrongIds([]); 
    setCurrentIndex(0);
    setIsFlipped(false);
    setView('learn');
  };

  // 開始單字複習
  const startReviewSession = () => {
    const categoryData = JLPT_DATA[currentCategory];
    const categoryWrongIds = wrongWords.filter(id => id.startsWith(currentCategory.toLowerCase())); 
    
    if (categoryWrongIds.length === 0) { return; } 
    
    const reviewList = categoryData.filter(w => categoryWrongIds.includes(w.id));
    const shuffledReview = [...reviewList].sort(() => 0.5 - Math.random());
    
    setDailyBatch(shuffledReview);
    setQuizModes(generateModes(shuffledReview.length));
    setIsReviewMode(true);
    setIsLoopingReview(false);
    setSessionWrongIds([]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setView('learn');
  };

  // 開始五十音隨機測驗
  const startKanaQuiz = () => {
    const targetKana = FLAT_KANA.filter(k => k.type === kanaTab);
    const shuffled = [...targetKana].sort(() => 0.5 - Math.random());
    const batch = shuffled.slice(0, 10); // 一次測10個
    
    setDailyBatch(batch);
    setSessionWrongIds([]);
    setCurrentIndex(0);
    setIsReviewMode(false); // 不是複習模式
    setView('kana_quiz');
  };

  // 開始五十音錯題複習
  const startKanaReviewSession = () => {
    // 找出所有錯題對應的完整資料
    const targetReviewKana = FLAT_KANA.filter(k => wrongKana.includes(k.char));
    
    if (targetReviewKana.length === 0) return;

    const shuffled = [...targetReviewKana].sort(() => 0.5 - Math.random());
    const batch = shuffled.slice(0, 10); // 一次最多複習10個

    setDailyBatch(batch);
    setSessionWrongIds([]);
    setCurrentIndex(0);
    setIsReviewMode(true); // 開啟複習模式標記
    setView('kana_quiz');
  };

  const checkBadges = (currentStreak) => {
    const newBadges = [];
    if (!badges.includes('first_step')) newBadges.push('first_step');
    if (currentStreak >= 3 && !badges.includes('streak_3')) newBadges.push('streak_3');
    
    const n5Total = JLPT_DATA['N5'].length;
    const n5Learned = learnedWords.filter(id => id.startsWith('n5')).length;
    if (n5Learned >= n5Total && !badges.includes('n5_master')) newBadges.push('n5_master');

    if (newBadges.length > 0) {
      setBadges(prev => [...prev, ...newBadges]);
      const badgeInfo = BADGES_DATA.find(b => b.id === newBadges[0]);
      if (badgeInfo) setNewUnlock({ type: 'badge', name: badgeInfo.name, icon: badgeInfo.icon, color: badgeInfo.color });
    }
  };

  const handleSessionComplete = () => {
    // JLPT 模式才紀錄 learnedWords
    if (!isReviewMode && !isLoopingReview && view !== 'kana_quiz') {
      const newIds = dailyBatch.map(w => w.id);
      const uniqueNewLearned = [...new Set([...learnedWords, ...newIds])];
      setLearnedWords(uniqueNewLearned);
      const newStreak = streak + 1;
      setStreak(newStreak);
      checkBadges(newStreak);
    } 
    // 五十音測驗滿分徽章 (非複習模式下)
    else if (view === 'kana_quiz' && sessionWrongIds.length === 0 && !isReviewMode) {
      if (!badges.includes('kana_master')) {
        setBadges(prev => [...prev, 'kana_master']);
        const badgeInfo = BADGES_DATA.find(b => b.id === 'kana_master');
        setNewUnlock({ type: 'badge', name: badgeInfo.name, icon: badgeInfo.icon, color: badgeInfo.color });
      }
    }
  };

  // --- UI Components ---

  const UnlockModal = () => {
    if (!newUnlock) return null;
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-3xl p-8 text-center shadow-2xl max-w-xs mx-4 transform animate-in zoom-in duration-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-50 to-transparent opacity-50 pointer-events-none" />
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 text-white shadow-lg ${newUnlock.color || 'bg-yellow-400'} animate-bounce`}>
            {newUnlock.type === 'badge' ? newUnlock.icon : <Trophy size={40} />}
          </div>
          <h3 className="text-2xl font-extrabold text-gray-800 mb-2 tracking-tight">
            {newUnlock.type === 'badge' ? '徽章解鎖！' : '等級提升！'}
          </h3>
          <div className="text-lg text-gray-500 font-medium mb-8">{newUnlock.name}</div>
          <button onClick={() => setNewUnlock(null)} className="w-full bg-gray-900 text-white px-6 py-3.5 rounded-xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all">太棒了！</button>
        </div>
      </div>
    );
  };

  const BackgroundDecor = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] rounded-full bg-emerald-200/30 blur-3xl" />
      <div className="absolute top-[40%] -right-[10%] w-[60%] h-[50%] rounded-full bg-sky-200/30 blur-3xl" />
      <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl" />
    </div>
  );

  const MultipleChoiceQuiz = ({ word, mode, onAnswer, isKanaQuiz = false }) => {
    const [selectedId, setSelectedId] = useState(null);
    const [showFeedback, setShowFeedback] = useState(false);
    
    useEffect(() => { 
      if (!isKanaQuiz && mode === 'listening' && !showFeedback) setTimeout(() => speak(word.word), 500); 
    }, [word, mode, showFeedback, isKanaQuiz]);

    const [options, setOptions] = useState([]);
    useEffect(() => {
      let distractors;
      if (isKanaQuiz) {
        // 五十音測驗：干擾項為其他假名的羅馬拼音
        const otherKana = FLAT_KANA.filter(k => k.char !== word.char);
        distractors = otherKana.sort(() => 0.5 - Math.random()).slice(0, 3);
        setOptions([word, ...distractors].sort(() => 0.5 - Math.random()));
      } else {
        // 單字測驗
        const currentLevelWords = JLPT_DATA[currentCategory] || JLPT_DATA['N5'];
        const otherWords = currentLevelWords.filter(w => w.id !== word.id);
        distractors = otherWords.sort(() => 0.5 - Math.random()).slice(0, 3);
        setOptions([word, ...distractors].sort(() => 0.5 - Math.random()));
      }
      
      setSelectedId(null);
      setShowFeedback(false);
    }, [word, currentCategory, isKanaQuiz]);

    const handleOptionClick = (option) => {
      if (showFeedback) return; 
      // 判斷邏輯
      const isCorrect = isKanaQuiz ? (option.char === word.char) : (option.id === word.id);
      
      setSelectedId(isKanaQuiz ? option.char : option.id);
      setShowFeedback(true);
      playSound(isCorrect ? 'correct' : 'wrong');
      
      if(isKanaQuiz && isCorrect) speak(word.char); // 五十音答對念一下

      setTimeout(() => { onAnswer(isCorrect); }, 1500); 
    };

    return (
      <div className="flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700 z-10">
        <div className="flex flex-col items-center mb-8">
          {!isKanaQuiz && mode === 'listening' ? (
            <button onClick={() => speak(word.word)} className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center hover:shadow-lg hover:scale-105 transition-all shadow-indigo-200 mb-6">
              <Volume2 size={48} />
            </button>
          ) : (
            <h2 className="text-6xl font-black text-center text-slate-800 mb-4 tracking-tight drop-shadow-sm">{isKanaQuiz ? word.char : word.word}</h2>
          )}
          
          <span className="px-4 py-1.5 bg-white/60 backdrop-blur text-slate-500 text-xs rounded-full font-bold tracking-widest uppercase shadow-sm border border-white/50">
            {isKanaQuiz ? '請選擇正確讀音' : (mode === 'listening' ? '聽力測驗' : '字義測驗')}
          </span>
        </div>
        <div className="space-y-3">
          {options.map((option) => {
            const currentId = isKanaQuiz ? option.char : option.id;
            const targetId = isKanaQuiz ? word.char : word.id;
            
            const isSelected = selectedId === currentId;
            const isCorrect = currentId === targetId;
            
            let btnClass = "bg-white/70 border-white/60 hover:bg-white hover:shadow-md"; 
            if (showFeedback) {
              if (isCorrect) btnClass = "bg-green-500 border-green-600 text-white shadow-lg scale-[1.02]";
              else if (isSelected && !isCorrect) btnClass = "bg-red-500 border-red-600 text-white";
              else btnClass = "bg-white/40 border-transparent opacity-50";
            }
            return (
              <button key={currentId} onClick={() => handleOptionClick(option)} disabled={showFeedback} className={`w-full p-5 text-left backdrop-blur-sm border rounded-2xl shadow-sm transition-all duration-300 group ${btnClass}`}>
                <div className="flex justify-between items-center">
                  <span className={`font-medium text-lg ${showFeedback && (isCorrect || isSelected) ? 'text-white' : 'text-slate-700'}`}>
                    {isKanaQuiz ? option.romaji : option.def}
                  </span>
                  {!isKanaQuiz && showFeedback && (isCorrect || isSelected) && (<span className="text-xs opacity-80 ml-2">{option.reading}</span>)}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // --- 主要視圖 ---

  const renderHome = () => {
    const categoryTotal = JLPT_DATA[currentCategory].length;
    const categoryLearned = learnedWords.filter(id => id.startsWith(currentCategory.toLowerCase())).length;
    const categoryWrong = wrongWords.filter(id => id.startsWith(currentCategory.toLowerCase())).length;
    const progress = Math.round((categoryLearned / categoryTotal) * 100);
    const currentRank = getCurrentRank();
    
    return (
      <div className="flex flex-col h-full relative">
        <BackgroundDecor />
        <div className="p-6 pb-2 z-10 flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
               JLPT 單字帳 <span className="text-2xl">🇯🇵</span>
             </h1>
             <p className="text-slate-500 text-sm font-medium">選擇等級，開始挑戰！</p>
           </div>
           <button onClick={() => setView('profile')} className="w-10 h-10 bg-white/80 backdrop-blur rounded-full shadow-sm border border-white flex items-center justify-center hover:scale-105 transition-all">
             <User size={20} className="text-slate-600" />
           </button>
        </div>

        {/* 級別選擇器 */}
        <div className="px-6 py-2 z-10">
          <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2 scrollbar-hide">
            {['N5', 'N4', 'N3', 'N2', 'N1'].map(level => (
              <button
                key={level}
                onClick={() => setCurrentCategory(level)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                  currentCategory === level 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                  : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col px-6 py-4 space-y-6 overflow-y-auto z-10 pb-20 custom-scrollbar">
          
          <div className={`w-full p-5 rounded-3xl shadow-sm border ${currentRank.bg} ${currentRank.border} flex items-center justify-between cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all`} onClick={() => setView('profile')}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-2xl`}>
                {currentRank.icon}
              </div>
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">玩家等級</div>
                <div className={`font-bold text-lg ${currentRank.color}`}>{currentRank.name}</div>
              </div>
            </div>
            <div className="bg-white/50 p-2 rounded-full"><ChevronRight className="text-slate-400" size={20} /></div>
          </div>

          {/* 五十音練習入口 */}
          <button 
            onClick={() => setView('kana_chart')}
            className="w-full bg-pink-100/80 backdrop-blur border border-pink-200 p-5 rounded-3xl shadow-sm flex items-center justify-between hover:bg-pink-200/80 transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-500 rounded-2xl shadow-lg shadow-pink-300 text-white flex items-center justify-center">
                <Grid size={24} />
              </div>
              <div className="text-left">
                <div className="text-pink-900 font-bold text-lg">五十音練習</div>
                <div className="text-pink-600 text-xs font-medium">平假名 • 片假名 • 發音</div>
              </div>
            </div>
            <div className="bg-white/50 p-2 rounded-full group-hover:bg-white transition-colors">
              <ChevronRight className="text-pink-400" size={20} />
            </div>
          </button>

          <div className="w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-indigo-100/50 p-6 space-y-5 border border-white/60">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 text-slate-700">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><GraduationCap size={20} /></div>
                <span className="font-bold text-sm">{currentCategory} 進度</span>
              </div>
              <span className="text-2xl font-black text-slate-800">{categoryLearned} <span className="text-sm text-slate-400 font-semibold">/ {categoryTotal}</span></span>
            </div>
            <div className="space-y-2">
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-end">
                <span className="text-xs font-bold text-indigo-500">{progress}% 完成</span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-2">
                <Flame size={18} className="text-orange-500" fill="currentColor" />
                <span className="font-bold text-sm text-slate-600">連續學習</span>
              </div>
              <span className="text-xl font-black text-slate-800">{streak} <span className="text-sm font-medium text-slate-400">天</span></span>
            </div>
          </div>

          {categoryWrong > 0 && (
            <div className="w-full bg-red-50/80 backdrop-blur rounded-2xl border border-red-100 p-4 flex items-center justify-between shadow-sm animate-in slide-in-from-bottom-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white p-2 rounded-full text-red-500 shadow-sm"><AlertCircle size={20} /></div>
                <div>
                  <div className="font-bold text-red-900 text-sm">{currentCategory} 弱點加強</div>
                  <div className="text-xs text-red-500 font-medium">{categoryWrong} 個單字需要複習</div>
                </div>
              </div>
              <button onClick={startReviewSession} className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-red-500/30 hover:bg-red-600 transition-all">立即複習</button>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white/90 to-transparent z-20 flex flex-col gap-3">
           <button onClick={startDailySession} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-gray-900/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group">
            <span className="text-lg">開始 {currentCategory} 學習</span>
            <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform"><ChevronRight size={16} /></div>
          </button>
          <button onClick={() => setView('stats')} className="text-slate-500 text-xs font-bold text-center py-2 hover:text-indigo-600 transition-colors">
            查看 {currentCategory} 單字庫
          </button>
        </div>
      </div>
    );
  };

  const renderKanaChart = () => {
    return (
      <div className="h-full flex flex-col relative bg-pink-50/50">
        <BackgroundDecor />
        <div className="p-6 pb-2 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setView('home')} className="w-10 h-10 bg-white rounded-full shadow-sm border border-pink-100 flex items-center justify-center hover:bg-pink-50 mr-4">
              <ArrowLeft size={20} className="text-pink-600" />
            </button>
            <h2 className="font-black text-xl text-slate-800">五十音表</h2>
          </div>
          <button 
            onClick={() => setKanaTab(kanaTab === 'hira' ? 'kata' : 'hira')}
            className="px-4 py-2 bg-white rounded-full text-sm font-bold text-pink-600 shadow-sm border border-pink-100 hover:bg-pink-50 transition-all"
          >
            切換：{kanaTab === 'hira' ? '片假名' : '平假名'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 z-10 custom-scrollbar pb-24">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-4 shadow-xl border border-white/60 mb-6">
             <div className="grid grid-cols-5 gap-2 mb-2 text-center text-xs font-bold text-slate-400">
               <div>A</div><div>I</div><div>U</div><div>E</div><div>O</div>
             </div>
             {KANA_DATA.map((row, idx) => (
               <div key={idx} className="grid grid-cols-5 gap-2 mb-2">
                 {(kanaTab === 'hira' ? row.hira : row.kata).map((char, cIdx) => (
                   <div key={cIdx} className="aspect-square">
                     {char ? (
                       <button 
                         onClick={() => speak(char)}
                         className={`w-full h-full rounded-xl shadow-sm border flex flex-col items-center justify-center hover:scale-105 transition-all active:scale-95 ${wrongKana.includes(char) ? 'bg-red-50 border-red-200' : 'bg-white border-slate-100 hover:bg-pink-50 hover:border-pink-200'}`}
                       >
                         <div className={`text-xl font-bold ${wrongKana.includes(char) ? 'text-red-500' : 'text-slate-700'}`}>{char}</div>
                         <div className="text-[10px] text-slate-400 font-mono">{row.romaji[cIdx]}</div>
                       </button>
                     ) : (
                       <div className="w-full h-full"></div>
                     )}
                   </div>
                 ))}
               </div>
             ))}
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-pink-50 via-pink-50/90 to-transparent z-20 flex flex-col gap-3">
           {wrongKana.length > 0 && (
             <button onClick={startKanaReviewSession} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-2xl shadow-xl shadow-red-500/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-2 animate-in slide-in-from-bottom-2">
               <AlertCircle size={20} />
               <span>弱點特訓 ({wrongKana.length} 個)</span>
             </button>
           )}
           <button onClick={startKanaQuiz} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-xl shadow-pink-500/30 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group">
            <span className="text-lg">隨機測驗</span>
            <div className="bg-white/20 rounded-full p-1 group-hover:translate-x-1 transition-transform"><Grid size={16} /></div>
          </button>
        </div>
      </div>
    );
  };

  const renderKanaQuiz = () => {
    if (currentIndex >= dailyBatch.length) {
      const isPerfect = sessionWrongIds.length === 0;
      return (
        <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in zoom-in duration-500 relative">
          <BackgroundDecor />
          <div className="z-10 w-full max-w-sm">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 shadow-xl ring-8 ring-white/50 ${isReviewMode ? 'bg-red-100 text-red-500' : isPerfect ? 'bg-yellow-100 text-yellow-500' : 'bg-pink-100 text-pink-500'}`}>
              {isReviewMode ? <CheckCircle size={48} strokeWidth={3} /> : <Trophy size={48} strokeWidth={3} />}
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">{isReviewMode ? '複習完成！' : '測驗完成！'}</h2>
            <p className="text-slate-500 font-medium mb-10">{isReviewMode ? '答對的項目已從錯題本移除。' : isPerfect ? '太厲害了！全部答對！' : '繼續加油，熟能生巧！'}</p>
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60 mb-8">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">答對率</div>
              <div className="text-3xl font-black text-pink-500 mb-2">{dailyBatch.length - sessionWrongIds.length} / {dailyBatch.length}</div>
            </div>
            <button onClick={() => { handleSessionComplete(); setDailyBatch([]); setView('kana_chart'); }} className={`w-full text-white py-4 rounded-2xl font-bold shadow-xl transition-all ${isReviewMode ? 'bg-red-500 hover:bg-red-600' : 'bg-pink-500 hover:bg-pink-600'}`}>返回圖表</button>
          </div>
        </div>
      );
    }

    const currentWord = dailyBatch[currentIndex];
    
    const handleAnswer = (isCorrect) => {
      if (!isCorrect) {
        // 答錯：加入當次測驗錯題ID
        setSessionWrongIds(prev => [...prev, currentWord.char]);
        // 答錯：加入永久錯題本 (如果還沒在裡面)
        if (!wrongKana.includes(currentWord.char)) {
          setWrongKana(prev => [...prev, currentWord.char]);
        }
      } else {
        // 答對且是複習模式：從永久錯題本移除
        if (isReviewMode) {
          setWrongKana(prev => prev.filter(c => c !== currentWord.char));
        }
      }
      setCurrentIndex(prev => prev + 1);
    };

    return (
      <div className={`flex flex-col h-full relative ${isReviewMode ? 'bg-red-50/30' : 'bg-pink-50/30'}`}>
        <BackgroundDecor />
        <div className="p-6 z-10">
          <div className={`flex justify-between text-sm mb-3 font-bold ${isReviewMode ? 'text-red-500' : 'text-pink-500'}`}>
            <div className="flex items-center space-x-2">
              <span>{isReviewMode ? '弱點特訓' : kanaTab === 'hira' ? '平假名測驗' : '片假名測驗'}</span>
            </div>
            <span>{currentIndex + 1} / {dailyBatch.length}</span>
          </div>
          <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full rounded-full transition-all duration-500 ease-out ${isReviewMode ? 'bg-red-500' : 'bg-pink-500'}`} style={{ width: `${((currentIndex + 1) / dailyBatch.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-6 pb-8 z-10">
           <MultipleChoiceQuiz word={currentWord} mode="standard" onAnswer={handleAnswer} isKanaQuiz={true} />
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const currentRank = getCurrentRank();
    
    return (
      <div className="h-full flex flex-col relative bg-slate-50/50">
        <BackgroundDecor />
        <div className="p-6 pb-2 z-10 flex items-center">
          <button onClick={() => setView('home')} className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 mr-4">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <h2 className="font-black text-xl text-slate-800">個人檔案</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 custom-scrollbar">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl shadow-indigo-100/40 border border-white/60 text-center">
              <div className={`w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 text-4xl shadow-lg rotate-3 ${currentRank.bg} border-4 border-white`}>
                {currentRank.icon}
              </div>
              <h2 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">{currentRank.name}</h2>
              <p className="text-slate-400 text-sm font-medium mb-8 tracking-wide">總計已學 {learnedWords.length} 個單字</p>
              
              <div className="grid grid-cols-5 gap-2">
                {['N5', 'N4', 'N3', 'N2', 'N1'].map(lvl => {
                  const learned = learnedWords.filter(id => id.startsWith(lvl.toLowerCase())).length;
                  const total = JLPT_DATA[lvl].length;
                  const pct = Math.round(learned/total * 100);
                  return (
                    <div key={lvl} className="flex flex-col items-center">
                      <div className="text-[10px] font-bold text-slate-400 mb-1">{lvl}</div>
                      <div className="w-full bg-slate-200 h-16 rounded-lg relative overflow-hidden flex items-end justify-center">
                        <div className={`absolute bottom-0 left-0 w-full bg-indigo-500 opacity-80 transition-all`} style={{height: `${pct}%`}}></div>
                        <span className="relative z-10 text-[10px] font-bold text-slate-600 mb-1">{pct}%</span>
                      </div>
                    </div>
                  )
                })}
              </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/60">
             <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Settings size={18} className="text-indigo-500" /> 語音設定
             </h3>
             <div className="space-y-2">
               <p className="text-xs text-slate-500 mb-2">選擇日文發音 (若無聲音請檢查靜音模式)</p>
               <div className="relative">
                 <select 
                   value={selectedVoiceURI} 
                   onChange={(e) => {
                     setSelectedVoiceURI(e.target.value);
                     speak("こんにちは、元気ですか"); 
                   }}
                   className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 >
                   {voices.length === 0 && <option value="">未偵測到日文語音包</option>}
                   {voices.map(v => (
                     <option key={v.voiceURI} value={v.voiceURI}>
                       {v.name} ({v.lang})
                     </option>
                   ))}
                 </select>
                 <Mic size={18} className="absolute left-3 top-3.5 text-slate-400" />
               </div>
             </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2 px-2">
              <Trophy size={18} className="text-amber-500" /> 
              <span>成就徽章</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {BADGES_DATA.map(badge => {
                const isUnlocked = badges.includes(badge.id);
                return (
                  <div key={badge.id} className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-3 transition-all ${isUnlocked ? 'bg-white border-white shadow-md shadow-indigo-100/50 scale-100' : 'bg-slate-50 border-slate-100 opacity-50 scale-95 grayscale'}`}>
                    <div className={`p-3.5 rounded-2xl shadow-sm text-white ${isUnlocked ? badge.color : 'bg-slate-300'}`}>
                      {isUnlocked ? badge.icon : <Lock size={24} />}
                    </div>
                    <div>
                      <div className={`font-bold text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>{badge.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium mt-0.5">{badge.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLearn = () => {
    const word = dailyBatch[currentIndex];
    const nextCard = () => {
      setIsFlipped(false); speak(""); 
      if (currentIndex < dailyBatch.length - 1) { setCurrentIndex(prev => prev + 1); } 
      else { setView('quiz'); setCurrentIndex(0); }
    };
    const prevCard = () => {
      if (currentIndex > 0) {
        setIsFlipped(false); speak("");
        setCurrentIndex(prev => prev - 1);
      }
    };

    return (
      <div className="flex flex-col h-full relative">
        <BackgroundDecor />
        <div className="flex justify-between items-center p-6 z-10">
          <button onClick={() => setView('home')} className="w-10 h-10 bg-white/50 backdrop-blur hover:bg-white rounded-full flex items-center justify-center text-slate-500 transition-colors"><XCircle size={24} /></button>
          <div className="px-4 py-1.5 bg-white/40 backdrop-blur rounded-full border border-white/30">
             <span className={`text-xs font-bold tracking-widest uppercase ${isLoopingReview ? 'text-orange-500' : isReviewMode ? 'text-red-500' : 'text-indigo-600'}`}>
              {isLoopingReview ? '錯題特訓' : isReviewMode ? '複習模式' : '學習中'} • {currentIndex + 1}/{dailyBatch.length}
            </span>
          </div>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col px-6 pb-8 z-10 perspective-1000">
           <div className="flex-1 relative cursor-pointer group perspective-1000" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`w-full h-full absolute transition-all duration-700 transform preserve-3d shadow-2xl shadow-indigo-200/50 rounded-[2.5rem] bg-white border border-white/60 ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className={`absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 text-center rounded-[2.5rem] bg-gradient-to-br ${isReviewMode || isLoopingReview ? 'from-red-50/80 via-white to-white' : 'from-indigo-50/80 via-purple-50/50 to-white'}`}>
                <span className={`text-xs mb-4 px-3 py-1 rounded-full bg-white/60 font-bold tracking-widest uppercase ${isReviewMode || isLoopingReview ? 'text-red-400' : 'text-slate-400'}`}>點擊翻轉</span>
                <h2 className="text-5xl font-black text-slate-800 mb-8 tracking-tight drop-shadow-sm">{word.word}</h2>
                <button onClick={(e) => { e.stopPropagation(); speak(word.word); }} className="w-16 h-16 rounded-full bg-white shadow-lg shadow-indigo-100 text-indigo-600 hover:scale-110 hover:text-indigo-700 transition-all flex items-center justify-center"><Volume2 size={28} /></button>
              </div>
              {/* Back */}
              <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col p-8 bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                   <div className="text-left">
                     <h3 className="text-3xl font-bold text-slate-800">{word.word}</h3>
                     <p className="text-lg text-indigo-500 font-bold">{word.reading}</p>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={(e) => { e.stopPropagation(); speak(word.word); }} className="p-2 rounded-full bg-slate-100 text-indigo-600 hover:bg-indigo-100 transition-colors"><Volume2 size={20} /></button>
                     <span className="text-sm bg-slate-800 text-white px-3 py-2 rounded-xl font-bold font-mono h-fit my-auto">{word.part}</span>
                   </div>
                </div>
                <div className="flex-1 space-y-6">
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">定義</div>
                    <p className="text-xl text-indigo-900 font-bold leading-relaxed">{word.def}</p>
                  </div>
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">例句</div>
                    <p className="text-slate-600 font-medium text-lg leading-relaxed mb-2">{word.example}</p>
                    <p className="text-slate-400 text-sm border-t border-slate-200 pt-2">{word.example_cn}</p>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); speak(word.example); }} className="mt-4 w-full py-3 rounded-xl border border-slate-200 text-slate-500 font-bold text-sm hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"><Volume2 size={16} /> 朗讀例句</button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button onClick={prevCard} disabled={currentIndex === 0} className={`p-4 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center ${currentIndex === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}><ArrowLeft size={20} /></button>
            <button onClick={nextCard} className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-2">{currentIndex < dailyBatch.length - 1 ? '下一個' : '開始測驗'} {currentIndex < dailyBatch.length - 1 && <ArrowRight size={20} />}</button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuiz = () => {
    if (currentIndex >= dailyBatch.length) {
      if (sessionWrongIds.length > 0) {
        const allCategoryWords = JLPT_DATA[currentCategory];
        const wrongWordsList = allCategoryWords.filter(w => sessionWrongIds.includes(w.id));
        setDailyBatch(wrongWordsList);
        setQuizModes(generateModes(wrongWordsList.length));
        setSessionWrongIds([]); 
        setCurrentIndex(0);
        setIsLoopingReview(true); 
        return (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in zoom-in duration-300">
            <BackgroundDecor />
            <div className="z-10 bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60">
              <div className="bg-orange-100 text-orange-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"><Repeat size={40} /></div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">錯題特訓開始</h2>
              <p className="text-slate-500 mb-6">還有 {wrongWordsList.length} 個單字需要加強，直到全部答對為止！</p>
              <button onClick={() => setCurrentIndex(0)} className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-orange-600">繼續挑戰</button>
            </div>
          </div>
        );
      } else {
        return renderResult();
      }
    }

    const currentWord = dailyBatch[currentIndex];
    const mode = quizModes[currentIndex];

    const handleAnswer = (isCorrect) => {
      if (!isCorrect) {
        if (!wrongWords.includes(currentWord.id)) setWrongWords(prev => [...prev, currentWord.id]);
        setSessionWrongIds(prev => [...prev, currentWord.id]);
      } else {
        if (isReviewMode) setWrongWords(prev => prev.filter(id => id !== currentWord.id));
      }
      setCurrentIndex(prev => prev + 1);
    };

    return (
      <div className="flex flex-col h-full relative">
        <BackgroundDecor />
        <div className="p-6 z-10">
          <div className="flex justify-between text-sm text-slate-500 mb-3 font-bold">
            <div className="flex items-center space-x-2">
              <span className={isLoopingReview ? "text-orange-500" : isReviewMode ? "text-red-500" : "text-indigo-500"}>{isLoopingReview ? "錯題特訓" : isReviewMode ? "複習測驗" : "隨堂測驗"}</span>
            </div>
            <span>{currentIndex + 1} / {dailyBatch.length}</span>
          </div>
          <div className="w-full bg-white/50 h-3 rounded-full overflow-hidden shadow-inner">
            <div className={`h-full rounded-full transition-all duration-500 ease-out ${isLoopingReview ? 'bg-orange-500' : isReviewMode ? 'bg-red-500' : 'bg-indigo-500'}`} style={{ width: `${((currentIndex + 1) / dailyBatch.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="flex-1 flex flex-col px-6 pb-8 z-10">
           <MultipleChoiceQuiz word={currentWord} mode={mode} onAnswer={handleAnswer} />
        </div>
      </div>
    );
  };

  const renderResult = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 text-center animate-in zoom-in duration-500 relative">
        <BackgroundDecor />
        <div className="z-10 w-full max-w-sm">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 shadow-xl ring-8 ring-white/50 ${isReviewMode ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'}`}>
            {isReviewMode ? <CheckCircle size={48} strokeWidth={3} /> : <Trophy size={48} strokeWidth={3} />}
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight">{isReviewMode ? '複習完成！' : '太棒了！'}</h2>
          <p className="text-slate-500 font-medium mb-10">{isLoopingReview ? '你已經克服了所有錯題！' : isReviewMode ? '你的弱點正在減少。' : '完成了今天的學習目標。'}</p>
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/60 mb-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">最終狀態</div>
            <div className={`text-3xl font-black ${isReviewMode ? 'text-red-500' : 'text-indigo-500'} mb-2`}>全部答對!</div>
          </div>
          <button onClick={() => { handleSessionComplete(); setDailyBatch([]); setView('home'); }} className={`w-full text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all ${isReviewMode ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'}`}>回首頁</button>
        </div>
      </div>
    );
  };

  const renderStats = () => {
    // 僅顯示當前級別的單字
    const currentList = JLPT_DATA[currentCategory];

    return (
      <div className="h-full flex flex-col bg-slate-50/50 relative">
        <BackgroundDecor />
        <div className="p-6 pb-2 z-10 flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setView('home')} className="w-10 h-10 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center hover:bg-slate-50 mr-4"><ArrowLeft size={20} className="text-slate-600" /></button>
            <h2 className="font-black text-xl text-slate-800">{currentCategory} 單字庫</h2>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-3 z-10 pb-20 custom-scrollbar">
          {currentList.map((item) => {
            const isLearned = learnedWords.includes(item.id);
            const isWrong = wrongWords.includes(item.id);
            return (
              <div key={item.id} className={`bg-white/80 backdrop-blur p-4 rounded-2xl border flex justify-between items-center shadow-sm hover:shadow-md transition-all ${isWrong ? 'border-red-200 bg-red-50/50' : isLearned ? 'border-emerald-200 bg-emerald-50/30' : 'border-white/60'}`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800 text-lg">{item.word}</span>
                    <span className="text-sm text-slate-500 font-medium">({item.reading})</span>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md uppercase">{item.part}</span>
                  </div>
                  <div className="text-sm text-slate-500 mt-1 font-medium">{item.def}</div>
                </div>
                {isLearned && !isWrong && <div className="bg-emerald-100 text-emerald-600 p-1 rounded-full"><CheckCircle size={16} /></div>}
                {isWrong && <div className="bg-red-100 text-red-500 p-1 rounded-full"><AlertCircle size={16} /></div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-screen bg-slate-100 font-sans text-slate-900 flex justify-center items-center p-4 sm:p-0">
      <div className="w-full max-w-md h-full sm:h-[850px] sm:rounded-[3rem] bg-slate-50 shadow-2xl overflow-hidden relative border-[8px] border-white ring-1 ring-slate-200/50">
        {newUnlock && <UnlockModal />}
        {view === 'home' && renderHome()}
        {view === 'learn' && renderLearn()}
        {view === 'quiz' && renderQuiz()}
        {view === 'stats' && renderStats()}
        {view === 'profile' && renderProfile()}
        {view === 'kana_chart' && renderKanaChart()}
        {view === 'kana_quiz' && renderKanaQuiz()}
      </div>
    </div>
  );
}