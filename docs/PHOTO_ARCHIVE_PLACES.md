# 미연결 장소 사진 아카이브 보강

> 현재 상태는 [사진 아카이브](PHOTO_ARCHIVE.md)를 기준으로 합니다. 아래는 조사 시점의 기록이며 연결 제안·확보 수가 현재 공개 상태를 뜻하지 않습니다. 2026-10-18 재감사에서 부적합 사진18개를 공개 자산에서 제외했고, 사진64장·대표 연결44/78개·미확보34개로 갱신했습니다.

확인일: 2026-10-18. 기존 개별 장소 사진 조사에 이어 Openverse 이미지 API와 Flickr 원문·태그 검색까지 확대했습니다. 검색 결과 수는 사용 가능한 사진 수로 간주하지 않았습니다. 내려받은 원본 또는 제공 축소본을 직접 시각 검토하고 저자·라이선스·촬영 시점과 장소 범위를 함께 기록했습니다.

## 새로 저장한 실제 사진

| 파일 / 연결 | 확인한 내용 | 원문·사용권 |
| --- | --- | --- |
| `archive-place-safu-museum.jpg` / `architecture-safu` | 차후가 있는 도모 미술관의 입구를 보여주는 2015년 가로 사진입니다. 공식 카페 주소와 저자의 도라노몬4-1-35 설명이 일치하고 사진에서 미술관 명판을 확인했습니다. **카페 실내 사진이 아니며 카페 개점 전 사진**임을 캡션 첫부분과 확인 범위에 표시했습니다. | [Daderot · Commons 원문](https://commons.wikimedia.org/wiki/File:Musée_Tomo_entrance_-_Tokyo,_Japan_-_DSC06677.JPG), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), [카페 공식 위치](https://safu.by-onko-chishin.com/en/) |
| `archive-place-loops-garden.jpg` / `architecture-loops` | LOOPS가 소재한 LUFTBAUM의 공용 실내정원입니다. 2025-09-12 촬영, 640×480 가로 원본. 저자 설명과 유리 외벽·수목이 있는 실제 장면을 확인했습니다. **LOOPS 매장 내부가 아님**을 캡션 첫부분에 표시했습니다. | [エコ殿様 · Commons 원문](https://commons.wikimedia.org/wiki/File:LUFTBAUM_04.jpg), [CC0](https://creativecommons.org/publicdomain/zero/1.0/), [NEWoMan 공식 LOOPS 위치](https://www.newoman.jp/takanawa/floorguide/detail/?scd=003054) |
| `archive-place-loops-panorama.jpg` / LOOPS 추가 사진 | 같은 LUFTBAUM 공용 공간의 2026-05-19 파노라마입니다. 수목·목조 전시 공간을 직접 확인했습니다. 1280×221 제공 축소본으로 초광각 구도 그대로 보존했습니다. **LOOPS 자체 매장 사진으로 사용하지 않습니다.** | [Souka Kinmei · Commons 원문](https://commons.wikimedia.org/wiki/File:NEWoMan_TAKANAWA_LUFTBAUM.jpg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

저장 계약은 `src/data/archivePlacePhotos.json`의 `photos`, 원래 항목 ID 기반 `spotPhotoIds`, 추가 사진용 `additionalSpotPhotoIds`입니다. 상점의 음식·좌석을 입증하는 사진으로 범위를 넓혀 해석하지 않습니다. 공유 사진 저장소와 테마 파일은 수정하지 않았습니다.

## 확대 검색에서 제외한 후보

- **치이카와랜드 도쿄역**: Openverse `chiikawa tokyo`와 `chiikawa`, Flickr 점포명 검색을 실시했습니다. [Joe Shlabotnik의 Chiikawa Tokyo Miyage](https://www.flickr.com/photos/40646519@N00/54524765578)는 Openverse에 CC BY-NC-SA로 등록되어 있으며 요청된 도쿄역 점포와도 동일하다고 확정하지 못했습니다. 타 지역 캐릭터 상품·대만 행사·홍콩 매장 사진도 제외했습니다. 도쿄 캐릭터스트리트의 2024년 Commons 사진은 직접 열어보니 동구리공화국·스누피 매장이어서 치이카와 점포에 연결하지 않았습니다. [캐릭터스트리트 Flickr 태그](https://www.flickr.com/photos/tags/tokyocharacterstreet/)의 현장 사진도 별도 재사용 허용 조건을 확인하지 못했습니다.
- **카페 차후 실내**: Openverse `safu cafe`, `Musée Tomo`, `智美術館`과 Flickr `safu`를 조회했습니다. 미술관 관련 CC0 사진을 찾았지만 카페 실내로 확정한 사진은 없었습니다. 실제 실내가 보이는 [방문기](https://azabu-guide.jp/safu/)는 공개 복제 사용권을 확인하지 못했습니다.
- **LOOPS 실내**: Openverse `LUFTBAUM`으로 실제 공용 공간 사진 10건을 찾고 Commons 원문을 확인했습니다. LUFTBAUM 02·03·04·05·06·08 및 파노라마를 직접 시각 검토한 뒤 대표 1장과 파노라마 1장만 저장했습니다. [조명 설계사 프로젝트](https://www.modulex.jp/projects/161287)는 실제 매장 사진이지만 공개 복제 사용권이 확인되지 않아 내려받아 게시하지 않았습니다.
- **롯폰기 세븐일레븐**: Openverse `Roppongi seven eleven` 결과 2건은 비상업적 이용 조건으로 등록되어 있고 지정 롯폰기5초메점의 도쿄타워 조망임도 확정하지 못했습니다. [정확한 점포 공식 위치](https://seven-eleven.areamarker.com/711map/info/286798)와 일치하는 새 사진은 미확보입니다.
- **하마마쓰초 주차시설**: Openverse `Hamamatsucho parking`, Flickr·웹 검색까지 확대했습니다. 도쿄타워 지하주차장 계단 사진을 발견했으나 사용자 공유 좌표와 다른 위치이므로 제외했습니다. 지정 시설명을 특정하지 못한 상태는 유지합니다.
- **요요기 정확한 SNS 스폿**: Openverse `Yoyogi railway`, Flickr·웹 검색을 실시했습니다. 센다가야4-26 건널목을 명시한 [현장 게시물](https://www.lemon8-app.com/@japan..no..1/7627851550438998535?region=jp)은 발견했으나 공개 복제 허용 조건을 확인하지 못했습니다. 기존 요요기역 인근 CC0 철교 사진은 지역 대표 참고 범위이며 이 건널목의 정확 사진으로 연결하지 않습니다.

미확보는 사진이 존재하지 않는다는 의미가 아닙니다. 이번 조사에서 확인한 후보 중 대상 일치와 공개 웹앱 사용 조건을 함께 충족하는 매장·촬영지 실사진이 없었다는 의미입니다. 사진을 얻기 위한 외부 문의·메시지 발송·유료 구매는 하지 않았습니다.
