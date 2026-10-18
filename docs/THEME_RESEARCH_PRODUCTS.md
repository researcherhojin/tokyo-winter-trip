# 편의점·약국 관심 품목의 공식 근거

확인일: 2026-10-18. 편의점 7개와 약국 7개, 총 14개 항목을 조사했습니다. 기존 관심 목록은 수정하지 않았으며 `src/data/themeEvidence-products.json`에 표시용 요약·확인 범위·공식 링크를 분리했습니다.

사진 파일은 내려받거나 외부 서버에서 직접 표시하지 않습니다. `photoPageUrl`은 사진이 있는 원문 페이지이며 이미지 파일 URL이 아닙니다. 원문에 사진이 있어도 재사용 허가를 뜻하지 않습니다. 공유 상품의 정식명·포장이 불명확한 경우 유사 제품은 비교용 자료라고 표시하고, 미식별 메뉴나 제품에는 사진을 억지로 붙이지 않습니다.

| 관심 항목 | 확인한 공식 자료 | 반영 범위와 남은 확인 |
| --- | --- | --- |
| 몽고탄멘 조합 | [세븐프리미엄 제품](https://7premium.jp/product/search/detail?id=5038), [공식 사진 소개](https://7premium.jp/index.php/blog/detail?id=2012) | 매운 된장맛 컵라면 122g 목록 확인. 조합은 후기이며 사진 글은 2019년 포장입니다. |
| 카페라테 스무디 | [제조사 발표](https://prtimes.jp/main/html/rd/p/000000307.000155396.html) | 2025년 8월 수량 한정 출시 확인. 2026년 12월 판매 확정이 아닙니다. |
| 모찌푸요 | [로손 제품·사진](https://www.lawson.co.jp/recommend/original/detail/1530060_1996.html) | 우유 크림 제품명·소개 확인. 점포·방문일 재고는 미확인입니다. |
| 카르보나라 | [로손 생파스타 제품·사진](https://www.lawson.co.jp/recommend/original/detail/1528746_1996.html) | 공식 카르보나라 제품은 확인했으나 SNS 제품과 동일성 미확인입니다. |
| 고구마맛탕 | [세븐일레븐 2025년 발표·사진](https://www.sej.co.jp/company/news_release/news/2025/202509191000.html) | 냉동 대학이모 유사 상품 자료. 영상 속 상품·현재 판매·한국 반입 가능 여부는 미확인입니다. |
| 맥도날드 버거 | [일본 맥도날드 메뉴](https://www.mcdonalds.co.jp/menu/) | 제품명 미제공. 특정 메뉴명·사진으로 대체하지 않았습니다. |
| 보냉백 | [Standard Products 공식 판매처](https://item.rakuten.co.jp/daiso-officialshop/sp0029/) | 보온 토트백 규격 확인. 공유한 가방과 동일성·300/500엔 가격·재고 미확인입니다. |
| V로토 프리미엄 | [로토 제품·사진](https://jp.rohto.com/vrohto-premium-series/premium/) | 공식명·제2류 의약품 분류 확인. 사용 권고·효능 우열은 반영하지 않습니다. |
| 다이쇼 패치 | [다이쇼 제품 목록](https://brand.taisho.co.jp/kounaien/product/) | 공식 검색 색인에서 퀵케어·제품 사진 확인. 원문은 502 오류. A·퀵케어 중 공유 제품은 미확정입니다. |
| 미야플로라 | [제조사 EX 제품·사진](https://www.miyarisan.com/product/ミヤフローラⓡex/) | 공식명 EX·지정 의약부외품 분류·포장 확인. 공유 글과 같은 규격인지 미확인입니다. |
| 신비오페르민 S | [공식 제품](https://brand.taisho.co.jp/biofermin/product/s/), [제조사 발표](https://www.biofermin.co.jp/information/news_20220519.pdf) | 정제·세립과 지정 의약부외품 분류 확인. 제품 페이지 직접 조회는 시간 초과·502로 실패했고 사진 존재는 공식 검색 색인으로 확인했습니다. |
| 크로마이-N | [제조사 제품·사진](https://www.daiichisankyo-hc.co.jp/site_chlomyn/product/) | 공식명·제2류 의약품·12g 포장 확인. 증상별 임의 사용을 권하지 않습니다. |
| 츠메큐어 | [PMDA 첨부문서 검색](https://www.pmda.go.jp/PmdaSearch/otcSearch/) | 정확한 일본어 이름·제조사·상품 사진을 확인하지 못했습니다. 공식 제품 URL을 생성하지 않았습니다. |
| 헤파리제 | [제조사 의약품 계열](https://www.zeria.co.jp/hepa/iyaku/product/), [W 계열](https://www.zeria.co.jp/hepa/w/) | 의약품·음료·보충식품이 별개입니다. 공유 제품 라인은 미확인이고 선물·복용 추천을 하지 않습니다. |

약국 항목은 약 이름을 기억하고 제조사 설명서를 찾기 위한 관심 목록입니다. SNS의 제품 우열·개인 효능·진단·투약 주장을 한국어 설명에 옮기지 않았습니다. 사용 가능 여부는 개인 상태와 실제 포장·설명서를 약사에게 확인해야 합니다.

원문 접근 실패를 성공으로 기록하지 않았습니다. 다이쇼 패치·비오페르민은 검색 색인의 공식 페이지 정보와 제조사 발표를 보완 근거로 사용했고, 이를 각 항목의 `verificationNote`와 `photoNote`에 명시했습니다. 상품 가격은 변동성과 규격 혼동 때문에 새 요약에 고정하지 않았습니다.
