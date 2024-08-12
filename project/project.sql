use webdb2022;

CREATE TABLE `calendar` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `author_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `calendar` VALUES(1, '2022년 10월', '3일 개천절 14일 약속 18일 시험', '2022-10-12 16:25:43', 2);
INSERT INTO `calendar` VALUES(2, '2022년 9월', '9일 추석연휴 10일 추석 11일 추석연휴', '2022-10-12 16:27:25', 2);

CREATE TABLE `namecard` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `title` varchar(30) NOT NULL,
    `description` text,
    `created` datetime NOT NULL,
    `author_id` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `namecard` VALUES(1, '홍길동', '동에 번쩍, 서에 번쩍!', '2022-10-18 12:03:12', 2);
INSERT INTO `namecard` VALUES(1, '박남희', 'Tel) 010-2356-4578', '2022-10-19 12:03:12', 2);


CREATE TABLE `person` (
    `loginid` varchar(10) NOT NULL,
    `password` varchar(20) NOT NULL, 
    `name` varchar(20) NOT NULL,
    `address` varchar(50),
    `tel` varchar(13),
    `birth` varchar(8) NOT NULL,
    `class` varchar(2) NOT NULL,
    `grade` varchar(2) NOT NULL,
    PRIMARY KEY (`loginid`)
);

INSERT INTO `person` VALUES('abc', 'aaaaaa', '초코', '경기도 성남시 수정대로', '010-9876-5432', '20050306', 'C', 'B');
INSERT INTO `person` VALUES('admin', 'admin', '관리자', '', '', '20000102', 'A', 'G');
INSERT INTO `person` VALUES('hong', 'pass', '홍길동', '서울시 송파구 송파동 123-45', '010-1234-5678', '20020512', 'C', 'B');


CREATE TABLE `book` (
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(100) NOT NULL, 
    `publisher` varchar(100) NOT NULL,
    `author` varchar(100) NOT NULL,
    `stock` int NOT NULL,
    `pubdate` varchar(8) NOT NULL,
    `pagenum` int ,
    `ISBN` varchar(30) NOT NULL,
    `ebook` varchar(1) NOT NULL,
    `kdc` varchar(20),
    `img` varchar(30),
    `price` int,
    `nation` varchar(50) NOT NULL,
    `description` varchar(200),
    PRIMARY KEY (`id`)
);

INSERT INTO `book` VALUES(1, '과학이 필요한 시간', '동아시아', '궤도', 10, '20221017', 1, '9788962624670', 'Y', '과학', '/images/01.jpg', 14400, '국내도서', '여전히 적지 않은 이들이 과학을 이해하기 위한 문해력이 아직 자신에게 없으며, 가까이하기에는 지나치게 큰 인내심이 요구된다고 토로한다. 이런 이들을 위해, 유튜브 채널 〈안될과학〉의 진행자이 자 과학 커뮤니케이터인 저자가 과학의 26가지 핵심 주제들을 4년간 엄선해 엮었다. 『과학이 필요한 시간』이다.');
INSERT INTO `book` VALUES(2, '배반', '문학동네', '압둘라자크 구르나', 20, '20221020', 1, '9788954688765', 'N', '소설', '/images/default.jpg', 14400, '영미도서', ' 2021년 노벨문학상 수상자 압둘라자크 구르나의 일곱번째 장편소설 『배반』이 출간되었다.');
INSERT INTO `book` VALUES(3, '하얼빈', '문학동네', '김훈', 10, '20220803', 1, '9788954699914', 'Y', '소설', '/images/02.jpg', 14400, '국내도서', '‘우리 시대 최고의 문장가’ ‘작가들의 작가’로 일컬어지는 소설가 김훈의 신작 장편소설 『하얼빈』이 출간되었다.');
INSERT INTO `book` VALUES(4, '이 책은 돈 버는 법에 관한 이야기', '라곰', '고명환', 15, '20220919', 1, '9791189686536', 'N', '경제/경영', '/images/03.jpg', 15120, '국내도서', '장사 권프로, 월급쟁이부자들TV, 스터디언 등 320만 채널이 추천하고 송은이, 홍석천, 이랑주가 “돈을 주고라도 배워야 한다”며 강력 추천하는 책.');
INSERT INTO `book` VALUES(5, '데미안', '민음사', '헤르만 헤세', 30, '20090120', 1, '9788937460449', 'Y', '소설', '/images/04.jpg', 7200, '독일도서', '현실에 대결하는 영혼의 발전을 담은 헤르만 헤세의 걸작 『데미안』');
INSERT INTO `book` VALUES(6, '인간 실격', '민음사', '다자이 오사무', 25, '20120410', 1, '9788937461033', 'Y', '소설', '/images/05.jpg', 8100, '일본도서', '오직 순수함만을 갈망하던 여린 심성의 한 젊은이가 인간들의 위선과 잔인함에 의해 파멸되어 가는 과정을 그린 소설.');


CREATE TABLE `cart` (
    `cartid` int NOT NULL AUTO_INCREMENT,
    `custid` varchar(10) NOT NULL, 
    `bookid` int NOT NULL,
    `cartdate` varchar(8) NOT NULL,
    `qty` int, 
    PRIMARY KEY (`cartid`)
);

INSERT INTO `cart` VALUES(1, 'hong', 1, '20221109', 1);
INSERT INTO `cart` VALUES(2, 'hong', 2, '20221109', 2);
INSERT INTO `cart` VALUES(3, 'hong', 5, '20221114', 1);

CREATE TABLE `purchase` (
    `purchaseid` int NOT NULL AUTO_INCREMENT,
    `custid` varchar(10) NOT NULL, 
    `bookid` int NOT NULL,
    `purchasedate` varchar(8) NOT NULL,
    `price` int,
    `point` int,
    `qty` int,
    `cancel` varchar(1) NOT NULL DEFAULT 'N',
    `refund` varchar(1) NOT NULL DEFAULT 'N',
    PRIMARY KEY (`purchaseid`)
);

INSERT INTO `purchase` VALUES(1, 'hong', 1, '20221101', 14400, 144, 1, 'N', 'N');
INSERT INTO `purcahse` VALUES(2, 'hong', 3, '20221115', 28800, 288, 2, 'Y', 'Y');
INSERT INTO `purcahse` VALUES(3, 'hong', 3, '20221115', 43200, 432, 3, 'Y', 'N');
-- INSERT INTO `purcahse` VALUES();

CREATE TABLE `board` (
    `id` int NOT NULL AUTO_INCREMENT,
    `loginid` varchar(10) NOT NULL, 
    `name` varchar(20) NOT NULL,
    `date` varchar(8),
    `content` text,
    `title` varchar(200) NOT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `board` VALUES(1, 'hong', '홍길동', '20221110', '테스트입니다.', 'Test');
INSERT INTO `board` VALUES(2, 'hong', '홍길동', '20221110', '제품이 별로 없네요', '후기');
INSERT INTO `board` VALUES(3, 'hong', '홍길동', '20221110', '무슨 책이 잘 나가나요', '질문');
INSERT INTO `board` VALUES(4, 'admin', '관리자', '20221110', '저희 Nodejs 서점에 오신 모든 고객님들을 환영합니다.', '환영합니다.');
-- INSERT INTO `board` VALUES();