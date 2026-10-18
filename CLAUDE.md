# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

프로젝트 규칙·완료 기준·코드 리뷰 규칙은 AGENTS.md가 기준입니다. 여기서 중복하지 않습니다.

@AGENTS.md

## 작업 원칙

Andrej Karpathy가 지적한 LLM 코딩 실수를 줄이는 4원칙([정리본](https://github.com/forrestchang/andrej-karpathy-skills))을 이 저장소에 맞췄습니다. AGENTS.md에 이미 있는 항목(문제 재현, 성공 조건, 필요한 모듈만 수정)은 반복하지 않습니다.

1. **코딩 전에 생각한다.** 가정을 먼저 말합니다. 해석이 여러 개면 조용히 하나를 고르지 말고 선택지를 제시합니다. 특히 여행 정보는 계획·합의·결제·확정 중 무엇인지 모호하면 추측해 채우지 말고 묻습니다.
2. **단순하게.** 요청한 것만 구현합니다. 한 번 쓰는 코드에 추상화를 만들지 않고, 일어날 수 없는 상황의 오류 처리를 넣지 않습니다. 의존성 추가 전에 기존 도구(React 상태, `src/lib/` 함수, `node:test`)로 되는지 확인합니다.
3. **외과적으로 수정한다.** 바뀐 줄은 모두 요청과 연결돼야 합니다. 기존 스타일을 따릅니다. 이 저장소는 세미콜론 없는 간결한 한 줄 위주 코드라서 다른 스타일로 고치지 않습니다. 관련 없는 코드·문서는 리팩터링하지 않고 발견한 문제만 보고합니다. 내 변경으로 쓰이지 않게 된 import·함수는 지우고, 원래 있던 죽은 코드는 남겨 둡니다.
4. **목표로 검증한다.** "고친다"를 확인 가능한 조건으로 바꿉니다. 예를 들어 버그는 재현 테스트를 `tests/`에 추가해 실패를 확인한 뒤 고칩니다. 여러 단계 작업은 `단계 → 검증 방법` 목록으로 계획하고, 검증은 AGENTS.md의 실행·완료 기준을 따릅니다.

## 요청 장부

새 요청은 작업 전에 [`docs/INTENTS.md`](docs/INTENTS.md)에 번호·완료 기준과 함께 추가하고, 끝나면 상태와 검증 근거(Playwright 캡처·측정, 테스트)를 갱신합니다. 작업 흐름과 조사 프롬프트 형식은 [`docs/DEV_FLOW.md`](docs/DEV_FLOW.md)에 있습니다. 사진을 찾거나 바꿀 때는 `.claude/skills/tokyo-photo-vetting` 순서를 따릅니다.

## 리뷰 기준 (로컬 `/code-review`가 읽는 곳)

[공식 문서](https://code.claude.com/docs/en/code-review-customize)에 따르면 로컬 `/code-review`는 `CLAUDE.md`만 읽고 `REVIEW.md`는 GitHub Code Review 서비스만 읽습니다. 그래서 리뷰 기준을 여기에 둡니다(`REVIEW.md`는 같은 내용을 PR 서비스용으로 유지).

- **이 저장소의 실패(Important):** 공식 발표가 아닌 정보(보도·리스팅·검색 요약·지난해 값·추정)를 사실처럼 표시, 다른 장소·가게·제품 사진을 대표 사진으로 표시, 사진 자르기, 계획·예약·결제 상태 혼동, 비밀키 노출, 지도 실패로 앱 전체가 사라짐.
- **증거:** 지적마다 `파일:줄`을 붙입니다. 이름만 보고 추측하지 않습니다. 여행 정보 지적은 연 공식 페이지 URL과 짧은 원문 인용을 붙입니다.
- **요약 형식:** 첫 줄에 문제 개수, 없으면 「고칠 것 없음」. 심각도는 Important / Nit / Pre-existing. Nit은 3개까지.
- **건너뛰기:** 생성 파일(`docs/PHOTO_ARCHIVE.md`, `public/photos/archive.json`, `public/photos/LICENSE.md`), `output/`, `node_modules/`. cSpell·tsc·키 검사가 이미 잡는 항목.
- **반복 실수는 규칙으로:** 같은 지적이 두 번 나오면 이 목록에 한 줄로 추가합니다. 지금까지 추가된 것:
  - 공식 원문이 없는 정보는 카드·일정에 쓰지 않고, 실제 사진이 없는 후보는 사용자 확인 후 삭제합니다.
  - 카드·패널 수정 뒤에는 1440·1024·390px에서 간격·정렬을 측정합니다(한 화면 예시만 고치지 않고 같은 유형 전체를 찾습니다).
  - 개발 API는 `max-age=60`이라 데이터 수정 직후 1분 기다린 뒤 Playwright로 확인합니다.
  - 카드 본문에는 사진 주석 줄·관계 칩·휴무 칩·작품 영상 비교를 넣지 않습니다(사용자가 삭제 요청). 세부 정보는 「방문 정보·출처」 창에 둡니다.
  - 자유 라이선스 사진이 없을 때 구글 이미지 등 저작권 사진을 앱에 복사하지 않고 검색 링크로만 연결합니다.
  - 참고 사진은 카드와 같은 종류를 보여야 합니다(음식 → 그 음식, 상품 → 같은 종류의 상품). 제조사 본사·매장 외관·거리 사진은 쓰지 않습니다. 의약품은 브랜드가 읽히지 않는 같은 종류 사진만. 새 사진은 접촉 시트로 검수하고 사용자 확인 후 배포합니다.
  - 사진을 붙이기 전 카드가 가리키는 정확한 장소를 확인합니다(예: 「메이지진구 뮤지엄」 카드에 메이지 신궁 본전 사진 금지). 공식·보도자료 이미지는 22개 항목 약관 확인 결과 재사용 불가였습니다.

## 재개 시 먼저 볼 문서

- `docs/PROJECT_STATUS.md`: 현재 상태, 중단 지점, 후속 작업 우선순위·완료 기준
- `docs/ARCHITECTURE.md`: 모듈별 책임표(파일 → 책임). 새 모듈을 만들면 이 표를 갱신
- `docs/WORKFLOW.md`: 검증 절차와 반례 중심 리뷰 목록 / `docs/VERIFICATION.md`: 검증 결과 기록
- `docs/API.md`: 카탈로그 API 계약 / `docs/PHOTO_ARCHIVE.md`: 사진별 현황(생성 파일)

문서와 UI 문구는 한국어입니다.

## 명령

```bash
npm run dev          # 127.0.0.1:5173 (strictPort). 캐시는 node_modules/.vite-dev
npm run check        # test → spellcheck → security:scan 순서 실행
npm test             # 키 없는 빌드(output/test-build) 후 node --test tests/*.test.mjs
npm run qa:browser   # dev 서버가 떠 있어야 함. 결과: output/playwright/
npm run photos:archive  # public/photos/archive.json, docs/PHOTO_ARCHIVE.md, LICENSE.md 재생성
npm run build   # 배포용: .env의 지도 키가 번들에 들어감. 키는 Google Cloud에서 tokyo-winter-trip.pages.dev·*.tokyo-winter-trip.pages.dev·127.0.0.1:5173만 허용(2026-10-18 설정). 테스트 빌드는 계속 키 없이
npx wrangler pages deploy dist --project-name tokyo-winter-trip   # Cloudflare Pages(사용자 승인 후에만). functions/api가 Pages Functions
```

단일 테스트: `tests/app.test.mjs`는 `output/test-build/assets/*.js` 번들을 jsdom에 올리므로 먼저 `npm test`(또는 `VITE_GOOGLE_MAPS_API_KEY= npm run build -- --outDir output/test-build`)로 빌드해야 합니다. `catalog.test.mjs`·`notion.test.mjs`는 빌드 없이 실행됩니다.

```bash
node --test tests/catalog.test.mjs
node --test --test-name-pattern "live timetable" tests/notion.test.mjs
```

`qa:browser`는 Playwright CLI 래퍼를 `PLAYWRIGHT_CLI` 또는 기본값 `~/.codex/skills/playwright/scripts/playwright_cli.sh`에서 찾고 `tokyo-audit` 세션만 사용합니다. 시나리오는 `scripts/*-scenarios.mjs`에 나뉘어 있습니다.

`spellcheck`는 문서까지 검사합니다(`cspell.json`). 새 고유명사·로마자 표기를 추가하면 사전 갱신이 필요할 수 있습니다.

## 큰 구조

- **정적 기본 자료 + 선택적 서버 갱신.** 화면은 `src/data/`·`src/shared/catalog.ts`의 기본 자료를 즉시 표시하고, `/api/catalog/{trip,themes,preparation}`과 `/api/trip`(Notion) 응답은 검증을 통과한 경우에만 덮어씁니다. 그래서 Functions 없는 정적 배포·키 없는 실행이 모두 동작해야 합니다.
- **서버 로직은 런타임 중립.** `server/*.ts`(Notion 읽기, 응답·캐시)를 세 진입점이 공유합니다: Vite middleware(`vite.config.ts`, 개발), `api/`(Vercel), `functions/api/`(Cloudflare). 프런트는 서버 파일에서 타입만 import해 번들에 서버 코드가 들어가지 않게 유지합니다.
- **Notion 응답 처리.** `server/notion.ts`가 시간표 추출·참여자 이름 제거, `src/lib/liveTrip.ts`가 검증·화면 데이터 변환. 부분 실패는 마지막 정상 일정을 유지하고, 서버가 명시적으로 비활성을 반환할 때만 기본 일정으로 전환합니다. `reservationAnchors.ts`가 확인된 예약 시각을 Notion 시간표보다 우선합니다.
- **지도.** `src/lib/googleMaps.ts`가 SDK 로드(`maps`/`core` 라이브러리 분리), `TravelMap.tsx`가 마커·오류 대체 화면. 지도 실패는 일정·외부 길찾기(`links.ts`)에 영향을 주면 안 됩니다. 방문 번호는 `visits.ts`에서 지도·일정이 공유합니다.
- **URL 상태.** `src/lib/navigation.ts`가 `?day=N|all`, `view=themes|checklist`를 관리하며 기존 링크 호환을 유지합니다.
- **개인 상태는 기기 로컬.** 체크리스트·테마 저장·방문 진행(`useTravelProgress`)은 localStorage에만 저장하고 API에 포함하지 않습니다. 테마 ID 통합·삭제 시 `lib/themeOrganization.ts`의 별칭·제거 목록으로 기존 저장 값을 이어 줍니다.
- **테마 데이터.** 테마 후보 1곳의 설명·운영·공식 근거·휴무·사진 ID는 `src/data/spots/<테마>.json` 한 레코드에만 둡니다. 이전 겹침 파일은 `docs/data-audit/legacy/`(앱이 읽지 않음). 스타일은 `src/styles/`(base → trip → theme)에 화면별로 나눕니다.
- **사진.** 대표 사진은 `src/data/photos.json` manifest와 출처·라이선스 데이터로 관리합니다. `photoReview.json`의 제외 ID는 `photos.ts`·`themes.ts`가 재노출을 차단하고 `photos:archive`도 실패시킵니다. 주변 시설 사진을 대표 사진 확보로 집계하지 않습니다. 카드 틀은 4:3이고 사진을 자르지 않으므로 `lib/themePhoto.ts`의 `cardPhotoOrder`가 같은 장소·같은 시간대(낮/밤) 사진 중 틀을 가장 잘 채우는 것을 앞에 둡니다(정확한 사진을 참고 사진 뒤로 보내지 않음). 사진이 없으면 이름·주소·「공식 사진/이미지 검색」 라벨 타일을 씁니다.
- **테마 카드 구조.** `ThemeSpotCard.tsx`는 subgrid 6칸(사진·제목·설명·운영 정보·지도 버튼·정보 버튼)이라 같은 행의 카드가 칸마다 높이를 맞춥니다. 칸을 늘리거나 줄이면 `theme.css`의 `grid-row:span` 두 값을 함께 고칩니다. 운영 정보 전체·주소·출처·공식 자료는 `.theme-card-detail-open`을 눌러야 열리는 모달에만 렌더링되므로, 테스트·Playwright 시나리오는 그 버튼을 먼저 누르고 확인합니다.
- **테마 순서.** 사이드바 묶음과 기본 선택 테마는 `ThemeExplorer.tsx`의 `themeGroups`(첫 묶음의 첫 테마가 기본)이고, `src/data/spots/index.json`의 `order`도 같은 순서로 유지합니다. 테스트는 특정 테마를 기본값으로 가정하지 말고 이름으로 클릭합니다.
- **준비 체크 탭.** `Checklist.tsx`는 한 번에 한 단계(그룹)만 렌더링합니다. 전체 항목 수·체크 상태를 검사할 때는 `.prep-tabs [role=tab]`을 차례로 눌러 합산합니다.
- **테스트 캐시 분리.** 테스트·아카이브 스크립트는 `createServer({configFile:false, cacheDir:'node_modules/.vite-test-*', optimizeDeps:{noDiscovery:true}})`로 SSR 로드해 실행 중인 dev 서버 캐시를 건드리지 않습니다. 새 테스트도 같은 패턴을 따릅니다.
