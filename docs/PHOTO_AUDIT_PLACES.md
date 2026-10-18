# 장소·촬영 지점 사진 감사

확인일: 2026-10-18. 대상은 건축·서브컬처·타워 촬영지·요요기입니다. `photos.json`, `themePhotos.ts`, 공개 `photos/archive.json`을 대조했습니다. 파일이 존재하고 라이선스가 있어도 해당 매장·구도를 보여주지 않으면 정확한 장소 사진으로 계산하지 않습니다.

## 정확한 점포 사진으로 교체 완료한 항목

| 항목 | 저장 사진과 사용권 | 직접 확인한 범위 |
| --- | --- | --- |
| MEGA TOKYO | [Maplestrip · 매장 입구](https://commons.wikimedia.org/wiki/File:Mega_Tokyo_Pokémon_Center_1.jpg), [매장 내부](https://commons.wikimedia.org/wiki/File:Mega_Tokyo_Pokémon_Center_2.jpg), 각각 [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/). 2016-07-13 촬영. | 원문이 선샤인시티·이케부쿠로의 MEGA TOKYO로 명시합니다. 1280×960 가로 사진을 내려받아 간판·입구·계산대·당시 전시를 직접 확인했습니다. 기존 선샤인시티 건물 외관보다 해당 장소를 정확히 보여줍니다. 2016년 모습임을 캡션에서 숨기지 않았습니다. |
| 치이카와랜드 하라주쿠 | [LKMK64 · 原宿店](https://commons.wikimedia.org/wiki/File:原宿店.png), [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). 2023-04-04 촬영. | 908×1210 원본을 직접 열어 KIDDY LAND 간판, 창문의 **ちいかわらんど** 로고, 입구의 치이카와 전면 디스플레이를 확인했습니다. 원문도 키디랜드 하라주쿠점·보도에서 본 입구로 설명합니다. 세로 원본은 `contain`으로 유지합니다. 2013년 일반 건물 외관과 달리 해당 캐릭터 점포를 식별할 수 있습니다. 도쿄역점이나 2026년 현재 전시는 아닙니다. |

저장 파일은 `public/photos/audit-place-*` 3개, 메타데이터는 `src/data/auditedPlacePhotos.json`입니다. MEGA 대표ID `mega`를 유지해 일정·테마를 함께 교체했습니다. `mega-interior`는 추가 사진입니다. 현재 manifest와 실제 매핑에도 반영했고 63장이던 공개 자산에 별도 후다노쓰지 사진 1장을 더해 64장입니다. 최종 현황은 [사진 아카이브](PHOTO_ARCHIVE.md)를 기준으로 합니다.

## 제거 완료한 대표·추가 사진

- `starwars`: 2017년 PARCO 건물 외관으로 나중에 개점한 스타워즈 매장을 식별할 수 없습니다. 정확 매장 사진을 찾기 전 대표 연결 제거를 권합니다.
- `subculture-kiddy-building`: 2013년 일반 외관을 이번 2023년 치이카와 전면 입구 사진으로 교체할 수 있습니다.
- `archive-place-safu-museum`: 카페 개점 전의 미술관 입구입니다. 미술관과 같은 주소라는 이유로 카페 자체의 대표·갤러리 사진으로 계산하지 않습니다.
- `archive-place-loops-garden`, `archive-place-loops-panorama`: 같은 시설의 공용정원으로 LOOPS 매장이 보이지 않습니다. 개별 매장 사진 집계에서 제외합니다.
- `views-shiba-seven`: 원문은 도쿄타워·세븐일레븐·미나토구만 명시하고 점포명·GPS가 없습니다. 다른 사이트의 외관과 닮았다는 근거만으로 지정 지점을 확정하지 않습니다.
- `spot-fudanotsuji`: 제공 GPS가 사용자 지정 육교 좌표보다 약130m 남쪽입니다. 지정 육교의 실제 조망 사진으로 계산하지 않습니다.
- `spot-hamamatsu-area`: 공유 좌표와 가깝지만 높이·덱 이름·층이 미확인입니다. 지정 덱3층 사진으로 계산하지 않습니다.
- `new-place-yoyogi-bridge`: 요요기역 인근 철교인 것은 확인되지만 센다가야4초메의 SNS 구도와 동일 위치인지 미확인입니다. 정확 촬영 후보에는 연결하지 않습니다.

위 부적합 사진은 현재 manifest·대표·갤러리·공개 파일에서 제외했습니다. 아래 조사 이력에서의 ‘권고’는 현재 미적용 상태를 의미하지 않습니다.

## 후다노쓰지 좌표 기반 후속 확보

이전 `spot-fudanotsuji`를 재사용하지 않고 Commons 좌표100m 검색 결과를 확인했습니다.13개 후보를 내려받아 직접 검토했고, 그중 [DSC 1048](https://commons.wikimedia.org/wiki/File:DSC_1048_(23013874456).jpg)을 별도 `audit-fudanotsuji-bridge`로 연결했습니다. Zengame·CC BY2.0·2015-11-15 촬영. 저자 좌표35.645125,139.744202는 공유 좌표에서 약14m이며 사진은 보도육교의 높은 시점에서 도로와 도쿄타워를 보여줍니다. [미나토구2025 가을겨울 공식 관광 안내](https://www.city.minato.tokyo.jp/documents/125393/mc25aw_web_2.pdf#page=15)의 札の辻歩道橋 소개와 교차 도로·조망 방향을 대조했습니다. 당시 파리 추모 특별 조명·개축 전 구조라는 점을 캡션에 남겼습니다. 원본의 세로 비율을 유지하고 앱의 전체 보기로 확인할 수 있습니다. 현재 조명·육교 구조·방문일 통제는 별도 확인입니다.

`views-akabanebashi`는 저자가 교차점 조망으로 명시해 2015년 사진이라는 조건에서 유지할 수 있습니다. `views-azabudai`도 저자가 JP타워33층 조망으로 명시한 사진이지만 당시 촬영 가능성과 현재 일반인 출입 가능성은 별개입니다.

나머지 건축 시설 외관과 닌텐도·시부야 포켓몬·애니메이트·라디오회관·스카이트리 포켓몬 사진은 앞선 개별 시각 검토에서 해당 시설을 확인한 자료입니다. 촬영 시점을 유지하며 미래 전시·상품 재고·영업을 보장하지 않습니다.

## 이번 검색 경로와 미확보 범위

Commons `Pokemon Center Mega Tokyo` 검색과 [MEGA TOKYO 전용 분류](https://commons.wikimedia.org/wiki/Category:Mega_Tokyo_Pokémon_Center)에서 실제 매장 사진 9장을 발견했습니다. 1·2·3번을 모두 내려받아 직접 보고 대표·추가 2장만 저장했습니다. 키디랜드는 `Kiddy Land Harajuku`의 모든 검색 결과를 검토해 한자 파일명 `原宿店.png`의 2023년 입구를 찾았습니다. 영어 제목만 검색하는 방식에서 놓쳤던 자료입니다.

Openverse·Flickr의 키디랜드/하라주쿠/치이카와 검색도 대조했으며, 일반 상품 사진·다른 점포·옛 외관을 현 점포의 사진으로 대체하지 않았습니다. 치이카와 도쿄역, 스타워즈 실제 매장, 지정 롯폰기 점포 조망, 하마마쓰초 주차시설, 요요기 지정 구도는 아직 정확한 대상과 재사용 조건을 함께 충족하는 새 사진을 확보하지 못했습니다.
