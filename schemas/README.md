# Vercel JSON Schema

원본: https://openapi.vercel.sh/vercel.json

확인일: 2026-10-17. 원격 신뢰 허용 없이 편집기에서 검증할 수 있도록 원본 응답을 저장했습니다. 외부 $ref는 없고 내부 참조만 사용합니다. vercel.json은 이 로컬 파일을 참조합니다. Vercel의 향후 스키마 변경이 자동 반영되지는 않으므로 설정 변경 시 공식 원본과 갱신 여부를 검토합니다. 생성된 외부 스키마는 cSpell 대상에서 제외하며 앱 소스 검사는 유지합니다.

원본 SHA-256: 794e937aa846a4bf5537c5b8e00ce44342735f0b46a92644e26d924449e153e0

수정(2026-10-18): 원본은 `$schema`를 draft-04로 선언하지만 숫자형 `exclusiveMinimum`(draft-06 이상 문법)을 3곳에서 써서 편집기가 「Expected boolean」 경고를 냈습니다. 선언만 draft-07로 바꿨고 다른 내용은 원본과 같습니다. 수정 후 SHA-256: 8f49cb120b67b12412cd422213d8f7939954416caf29069e9636798a86fb3af3
