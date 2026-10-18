# Vercel 배포 준비

현재 앱은 React + TypeScript + Vite를 유지합니다. Vercel은 Vite와 별도 Node.js Functions를 지원합니다. Next.js 전환이 Vercel 배포의 필수 조건은 아닙니다. [Vite 공식 배포 안내](https://vercel.com/docs/frameworks/frontend/vite), [Functions 공식 안내](https://vercel.com/docs/functions/runtimes/node-js).

외부 배포, 프로젝트 연결, 저장소 생성·공개·푸시는 아직 수행하지 않았습니다.

## 준비된 설정

`vercel.json`에 Vite 프리셋, `npm run build`, `dist` 출력, Notion iframe 허용과 기본 보안 헤더, API 함수 제한 시간을 정의했습니다. 현재 경로는 `/`와 쿼리 문자열만 사용하므로 SPA 전체 rewrite가 필요하지 않습니다. `/api/trip`을 `index.html`로 덮어쓰는 규칙을 추가하지 마세요.

| 환경변수 | 위치 | 용도 |
| --- | --- | --- |
| `VITE_GOOGLE_MAPS_API_KEY` | 빌드 환경 | 브라우저 Google 지도. 배포 결과에서 볼 수 있는 공개용 제한 키 |
| `NOTION_API_TOKEN` | 서버 환경만 | 선택적 Notion 읽기. `VITE_` 접두사 금지 |

`api/trip.ts`는 GET만 허용하고 공통 서버 로직에 위임합니다. 토큰을 설정하지 않으면 정적 일정이 동작합니다. `functions/`는 Cloudflare 대안이며 Vercel에서 사용하지 않습니다. 프런트엔드 빌드와 TypeScript 검증은 로컬에서 수행하지만 Vercel의 실제 함수 패키징·실행 검증은 승인된 배포 후 수행해야 합니다.

## 승인 후 실행 순서

1. `npm ci`, `npm test`, `npm run spellcheck`, `npm run security:scan`을 통과시킵니다.
2. 사용할 Vercel 계정·프로젝트와 공개할 일정 범위를 확인합니다. 일정과 숙소 주소 구역이 노출되는 페이지입니다.
3. Git 연동 또는 Vercel CLI 방식으로 배포합니다. CLI의 `vercel` 명령도 외부 서비스 변경이므로 승인 후 실행합니다.
4. Framework Vite, Build `npm run build`, Output `dist`, Node.js 24를 확인합니다. 키가 필요하면 위 변수명을 정확히 입력합니다.
5. 실제 HTTPS 주소가 발급되면 Google Cloud의 HTTP 리퍼러에 **그 호스트만** 등록합니다. API 제한은 Maps JavaScript API만 유지합니다. `*.vercel.app` 전체 허용은 피합니다. 로컬 필요 시 `http://127.0.0.1:5173/*`를 별도로 등록합니다.
6. 선택적으로 Notion 읽기 integration을 연결하고 `NOTION_API_TOKEN`을 서버에 설정한 뒤 재배포합니다. [자동 반영 범위](NOTION_SYNC.md)를 먼저 확인합니다.
7. 해당 주소에서 지도·사진·다섯 날짜·체크리스트·서버 응답을 확인합니다. Notion `/embed`에 주소를 넣고 임베드 높이는 850px 전후로 조정합니다. 원본 Notion 수정은 아직 하지 않았습니다.
8. 실제 스마트폰에서 임베드 스크롤·새 탭 길찾기·저장 정책을 확인합니다. Vercel 배포 보호 설정 때문에 Notion 임베드가 로그인 화면을 보여주지 않는지 확인합니다.

브라우저 키는 보이지 않게 숨길 수 없으므로 HTTP 리퍼러·API 제한을 적용합니다. 공유한 키가 불필요하게 공개된 경우 교체를 검토합니다. 실제 키 값은 소스·문서·채팅에 재출력하지 않습니다.
