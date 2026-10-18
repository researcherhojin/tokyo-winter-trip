---
name: tokyo-detail-audit
description: Use after any UI or data change in the Tokyo travel map, and whenever the user reports a detail problem. Runs the request-ledger → implement → test → Playwright → next-step loop and sweeps every screen for the same class of issue.
---

# Tokyo map detail audit

사용자가 한 화면의 문제를 보여주면 그 화면만 고치지 않습니다. 같은 유형을 앱 전체에서 찾고, 검증을 통과한 뒤에만 다음 단계로 갑니다.

## 1. 접수

- `docs/INTENTS.md`에 번호·요지·완료 기준을 추가합니다. 상태는 대기 → 진행 → 검증 → 완료.
- 완료 기준은 측정 가능한 문장으로 씁니다. 예: 「13개 테마 카드 시작 위치가 1440·390에서 각각 한 값」.

## 2. 재현과 같은 유형 찾기

Playwright 세션은 사용자와 겹치지 않게 `tokyo-measure`를 씁니다(`qa:browser`는 `tokyo-audit`).

```bash
P(){ bash $HOME/.codex/skills/playwright/scripts/playwright_cli.sh -s=tokyo-measure "$@"; }
```

모든 화면을 훑습니다. 자동 점검은 `scripts/full-sweep.js`(26개 화면 상태 × 4개 폭 = 104)를 실행하고, 결과의 `failing`이 비어야 합니다.

```bash
P run-code "$(cat scripts/full-sweep.js)"
```

자동 점검 후에도 1440·390 캡처를 직접 봅니다.

| 화면 | 주소 |
| --- | --- |
| 여행 지도 | `/?day=1`…`/?day=5`, `/?day=all` |
| 테마 탐색 | `/?view=themes` 후 13개 테마 탭을 차례로 |
| 준비 체크 | `/?view=checklist` |
| 대화상자 | 필수 정보, 장소 상세, 사진 크게 보기, 작품 장면 비교 |

화면마다 확인합니다.

- 가로 넘침 없음, 버튼·링크·summary 44px 이상, 깨진 이미지 없음
- 같은 역할의 요소가 화면·테마·날짜마다 같은 위치·높이(측정값이 한 값)
- 같은 문장이 연달아 두 번 보이지 않음(캡션·크레딧 중복)
- 내부 메모가 사용자에게 보이지 않음: `Self-published|Commons 설명|직접 시각|검색 요약|타베로그|2차 자료|보도 기준|안내 매체|예년|(추정)|원문 403|공식 색인`
- 여행 정보는 공식 출처만. 지난해 값·추정·보도 기준 문장 금지

## 3. 구현

- 데이터는 공식 페이지를 열어 확인한 값만 씁니다. 조사가 넓으면 파일을 고치지 않는 조사 에이전트에 나누고 메인이 반영합니다.
- 사진은 자유 라이선스(CC0·PD·CC BY·CC BY-SA)만, 그 장소임을 설명·좌표·간판으로 확인하고 직접 봅니다. 자르지 않습니다.
- 데이터 수정 직후 개발 API는 60초 캐시가 있으니 1분 기다린 뒤 확인합니다.

## 4. 검증(통과해야 다음 단계)

1. `npm test`
2. 바뀐 화면을 Playwright로 측정·캡처하고 캡처를 직접 봅니다.
3. 회귀 방지가 필요하면 `scripts/intent-scenarios.mjs`에 해당 요청 번호로 검사를 추가합니다.
4. `npm run qa:browser`(오래 걸리므로 백그라운드로 실행해 사용자 메시지를 막지 않습니다)
5. 끝나면 `npm run check`, 키 없는 빌드 `VITE_GOOGLE_MAPS_API_KEY= npm run build`

## 5. 기록

- `docs/INTENTS.md` 상태와 근거(측정값·캡처 경로·테스트 이름)
- `docs/VERIFICATION.md`에 실행한 검증, 미검증 범위를 구분해서
