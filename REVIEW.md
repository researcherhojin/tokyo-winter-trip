# Review instructions

GitHub Code Review 서비스용입니다. 로컬 `/code-review`는 이 파일을 읽지 않으므로 같은 기준을 `CLAUDE.md`의 「리뷰 기준」에도 둡니다.

## What Important means here

여행 정보를 잘못 보여주는 변경만 Important입니다: 공식 발표가 아닌 정보를 사실로 표시, 다른 장소·제품 사진을 대표 사진으로 표시, 사진 자르기, 계획·예약·결제 상태 혼동, 비밀키 노출, 지도 실패가 일정·길찾기까지 막는 회귀. 스타일·이름·리팩터링 제안은 Nit입니다.

## Evidence

모든 지적에 `파일:줄`을 붙입니다. 여행 정보 지적은 공식 페이지 URL과 짧은 원문 인용이 있어야 합니다.

## Summary

첫 줄에 문제 개수를 씁니다. 없으면 「고칠 것 없음」이라고 씁니다.

## Cap the nits

Nit은 리뷰당 3개까지만 씁니다.

## Do not report

- `docs/PHOTO_ARCHIVE.md`, `public/photos/archive.json`, `public/photos/LICENSE.md` (생성 파일)
- `output/`, `node_modules/`
- cSpell·TypeScript·키 패턴 검사가 이미 잡는 항목

## Always check

- 새 여행 정보에 공식 출처 URL과 확인 날짜가 있는지
- 새 사진에 저작자·라이선스·원본 URL과 「비슷한 참고 사진」 표시 여부가 있는지
- 카드·패널 변경이 1440·1024·390px에서 가로 넘침 없이 정렬되는지
