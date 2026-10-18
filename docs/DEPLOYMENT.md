# Cloudflare Pages 배포 및 Notion 임베드

## 2026-10-18 사전 검토: 신규 배포는 Workers도 비교

사용자는 사진·야경 정리를 마친 뒤 Cloudflare 배포를 검토하기로 했으며, 실제 배포를 승인한 것은 아닙니다. [현재 Pages 공식 안내](https://developers.cloudflare.com/pages/framework-guides/)는 새 프로젝트에 Workers를 권장합니다. 이 앱에는 기존 React+Vite와 공통 서버 로직을 유지하는 **Workers Static Assets + API** 구성을 우선 검토하는 것이 적합합니다. 아래 Pages 설정은 기존에 준비한 호환 경로이며 Workers 설정·로컬 런타임 검증·실제 배포를 완료했다는 뜻은 아닙니다.

- [React+Vite 공식 배포 안내](https://developers.cloudflare.com/workers/framework-guides/web-apps/react/)
- [Static Assets와 API 구성](https://developers.cloudflare.com/workers/static-assets/)
- [정적 자산 요금·제한](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)

배포 전에는 정적 파일과 API 사용량, 서버 전용 NOTION_API_TOKEN, 공개 지도 키의 실제 도메인 제한, Notion iframe 헤더·체크 상태 저장 환경을 각각 확인합니다. 현재 개인 체크는 브라우저 로컬 저장이므로 배포만으로 일행 간 상태가 공유되지는 않습니다. 사진은 로컬 정적 파일로 제공하며 유료 이미지 서비스를 추가하지 않습니다.


이 문서는 실행 절차이며 외부 서비스 변경은 수행하지 않았습니다. GitHub 저장소 생성·공개·푸시와 실제 배포는 사용자 승인 후 진행합니다.

## 1. 배포 전 검토

1. 사용자 터미널에서 `npm ci`, `npm test`, `npm run security:scan`을 실행합니다.
2. `npm run dev`로 PC와 스마트폰 크기에서 `docs/VERIFICATION.md`를 확인합니다.
3. 일정과 숙소 주소 구역이 정적 번들에 포함됩니다. 참여자 이름은 화면에서 제거했습니다. 배포 주소를 아는 사람이 접근할 수 있는 범위를 고려해 공개 여부를 정합니다. QR·예약 번호·항공권 PDF는 포함하지 않습니다.
4. 실제 키는 `.env.local`과 Cloudflare 환경변수에만 입력합니다. `.env.example`은 빈 값으로 유지합니다. `.env.local`은 Git 추적 금지입니다.
5. Google JavaScript Map ID를 준비하고 `TravelMap.tsx`의 예제 Map ID를 교체합니다. 새 Routes/Places API는 필요하지 않습니다.

## 2. Cloudflare Pages 설정

GitHub 연결 방식 또는 대시보드의 Direct Upload 중 선택합니다. GitHub 저장소 생성·푸시는 별도 승인 작업입니다. Direct Upload로 로컬 `dist`를 올리는 것도 배포 승인이 필요합니다.

| 설정 | 값 |
| --- | --- |
| Framework preset | Vite |
| Root directory | 프로젝트 루트 |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node.js | 22.12 이상 (권장 24) |
| Environment variable | `VITE_GOOGLE_MAPS_API_KEY` |

키 없이 먼저 검토 배포할 수도 있습니다. 이 경우에도 일정·체크리스트·외부 길찾기는 동작합니다. 키를 설정하면 재배포해야 합니다. 실제 키가 들어간 `dist`는 GitHub에 커밋하지 않습니다. 브라우저용 키는 실행 시 클라이언트에서 볼 수 있으므로 리퍼러·API 제한이 필수입니다.

## 3. 실제 주소 확인 후 HTTP 리퍼러 제한

1. 배포 결과의 정확한 `https://<project>.pages.dev` 또는 커스텀 도메인을 확인합니다. 아직 실배포를 하지 않아 확정 URL은 없습니다.
2. Google Cloud `travel-map-511913` → APIs & Services → Credentials → 브라우저용 키로 이동합니다.
3. Application restrictions를 Websites (HTTP referrers)로 설정하고 필요한 주소만 등록합니다. 예:
   - `https://<확정된-project>.pages.dev/*`
   - 사용한다면 `https://<확정된-커스텀도메인>/*`
   - 개발 필요 시 `http://127.0.0.1:5173/*`, `http://localhost:5173/*`
4. API restrictions는 기존 **Maps JavaScript API**만 유지합니다. 모든 `*.pages.dev`를 허용하지 않습니다. 미리보기 배포의 다른 호스트도 필요하다면 확인된 호스트만 추가합니다.
5. 앱은 브라우저의 일반 리퍼러 정책을 사용합니다. 개발 주소의 `localhost`와 `127.0.0.1`은 서로 다른 호스트이므로 실제 사용하는 주소를 등록하세요. 인증 오류 코드가 `RefererNotAllowedMapError`이면 허용 주소와 현재 페이지 주소를 대조합니다.
6. 독립 페이지와 실제 Notion 임베드에서 지도·마커를 확인합니다. 키의 리퍼러는 임베드된 앱의 배포 origin을 기준으로 설정하고, Notion 도메인을 무조건 추가하지 않습니다.

API 호출량·예산 알림을 확인하세요. 이 앱은 유료 API 활성화·요금제 변경·결제 설정을 수행하지 않습니다. 실시간 경로를 앱에 직접 표시하는 기능을 나중에 검토한다면 Routes API의 필요성·예상 사용량·비용을 먼저 제시하고 승인받습니다.

## 4. Notion 임베드

1. 확정된 HTTPS 주소를 복사합니다. 특정 날짜는 `?day=3`, 전체는 `?day=all`로 열 수 있습니다.
2. 원본 Notion 페이지에서 `/embed`를 입력해 주소를 붙여 넣습니다. 원본 페이지 변경 역시 실제 진행 전에 사용자 승인 범위를 확인합니다.
3. 임베드 너비는 페이지 전체 폭, 높이는 850px 전후에서 조정합니다. 작은 폭에서는 지도·일정 전환이 표시됩니다.
4. `public/_headers`에 Notion origin을 위한 `frame-ancestors`를 준비했습니다. `X-Frame-Options: DENY/SAMEORIGIN`을 추가하면 임베드가 막힙니다. Cloudflare 설정이 별도로 헤더를 덮어쓰지 않는지 확인합니다.
5. iOS Safari·Android Chrome에서 날짜 선택, 모달, 새 탭 길찾기, 체크리스트 재접속을 확인합니다. 임베드 저장이 차단되면 독립 페이지에서 열거나 체크리스트 JSON 백업을 사용합니다.

## 5. 공개 전 최종 보안 확인

```bash
npm run security:scan
git check-ignore .env.local
git ls-files '.env*'
```

`.env.example` 외 환경파일이 추적되면 배포 전에 제거합니다. 키가 GitHub에 올라간 적이 있으면 파일 삭제만으로 해결되지 않습니다. Google Cloud에서 키를 교체하고 저장소 이력·Secret scanning 알림을 확인합니다. 이 작업에서는 Git 저장소·GitHub 원격을 생성하지 않았으므로 원격 이력 검증은 수행하지 않았습니다.

## 자동 반영을 사용할 때

일반 정적 업로드만으로는 서버 함수가 실행되지 않습니다. Git 기반 Pages 빌드 또는 Pages Functions를 포함하는 Wrangler 배포 방식이 필요합니다. `functions/api/trip.ts`와 서버 secret `NOTION_API_TOKEN`을 사용합니다. `public/_routes.json`은 함수 실행을 `/api/trip` 및 `/api/catalog/*`로 제한합니다. 카탈로그 세 API에는 비밀키가 필요하지 않으며, 함수가 없어도 번들 자료로 동작합니다. 실제 실행·배포는 승인 후 진행합니다. 상세 범위는 [Notion 연동 안내](NOTION_SYNC.md), [API 계약](API.md), [Cloudflare 공식 라우팅 안내](https://developers.cloudflare.com/pages/functions/routing/)를 참고하세요.
