# 여행 자료 읽기 API

지도·테마·준비 화면은 같은 유지관리 데이터에서 생성한 독립 읽기 계약을 사용합니다. 외부 Google Places API를 활성화하거나 개인 체크 상태를 서버에 저장하지 않습니다.

| 요청 | data 필드 | 소비 훅 |
| --- | --- | --- |
| `GET /api/catalog/trip` | `days`, `places` | `useTripCatalog`, `useTripSource` |
| `GET /api/catalog/themes` | `themes` | `useThemesCatalog` |
| `GET /api/catalog/preparation` | `checklist`, `suicaGuide`, `preparationSources`, `yoyogiSpot` | `usePreparationCatalog` |

공통 응답은 `{schemaVersion:1, resource, source:"maintained-catalog", data}`입니다. 요청마다 임의의 확인일을 생성하지 않습니다. 시설 정보의 확인 기준일은 장소·테마 자료에 보존합니다. 이 API는 배포된 자료 버전을 제공합니다. 새 여행 정보를 수집하는 검색 엔진이나 데이터베이스 쓰기 API가 아닙니다.

`GET`·`HEAD`만 허용하고 다른 메서드는 `405`, `Allow: GET, HEAD`를 반환합니다. 응답은 JSON, 60초 공개 캐시와 300초 재검증 유예를 사용합니다. 인증 토큰·여행자 이름·개인 체크 상태는 응답에 포함하지 않습니다.

## 실행 경계

`server/catalogResponse.ts`의 공통 처리기를 Vite 개발 서버, `api/catalog/*` Vercel Functions, `functions/api/catalog/*` Cloudflare Pages Functions가 공유합니다. 개발 서버 재시작 후 세 경로가 실제 JSON을 반환합니다. Vite preview나 Functions가 없는 정적 호스팅에서는 번들 자료로 동작합니다. Vercel·Cloudflare 어댑터는 로컬 계약 테스트로 검사하며 실제 외부 배포는 별도 승인 후 검증합니다.

클라이언트 `src/shared/catalog.ts`가 계약과 검증을 공유합니다. `src/lib/catalogClient.ts`는 HTTP 실패·HTML·스키마 불일치·누락 날짜·잘못된 장소 참조·자료 부분 응답을 거부합니다. 장소 설명의 방문 순서·팁·출처 배열, 테마의 선택 필드·사진 목록·연결 일자, 이동 수단과 예약 상태도 중첩 구조까지 검사합니다. null·객체가 텍스트 또는 배열 대신 들어오면 마지막 정상 자료를 유지합니다. `src/hooks/useCatalog.ts`는 번들 자료를 즉시 표시하고 검증을 통과한 데이터만 교체합니다. 요청은 10초 제한과 unmount 취소를 적용하며 실패 시 화면과 길찾기를 유지합니다.

일정의 기존 `GET /api/trip`은 선택적 Notion 시간표 덮어쓰기로 계속 사용합니다. `NOTION_API_TOKEN`은 서버 전용입니다. 지도 API의 인증과 별개이며 토큰이 없으면 `{enabled:false}`를 반환합니다. Notion API 실패는 마지막 정상 시간표를 유지합니다.

체크 완료·테마 저장은 브라우저 localStorage에만 남습니다. 모든 사용자가 공유하는 예약 확정 값과 기기별 완료 체크를 섞지 않습니다. 로그인·공유 DB·예약 처리·실시간 평점 조회는 구현하지 않았습니다.


테마 항목은 선택적 evidence 객체로 summary, officialUrl, photoPageUrl, checkedAt, photoNote, verificationNote를 제공합니다. URL은 HTTPS 또는 확인 자료가 없는 경우 null입니다. 사진 원문의 로고/과거 행사/소개 이미지와 정확한 방문 장소 사진은 photoNote로 구분합니다. 잘못된 evidence 객체·날짜·URL은 응답 적용 전에 거부합니다. 방문 상태는 서버로 전송하지 않고 tokyo-2026-visits-v1 로컬 저장소에 유지합니다.
