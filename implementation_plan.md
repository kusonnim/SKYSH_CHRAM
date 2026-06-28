# Stage Navigation UX Improvement Plan

## 현재 스테이지 구조 및 절차 분석 (Current Flow)
현재 차트 학습(SKYSH_CHRAM)의 스테이지(Stage) 진행 구조는 다음과 같이 설계되어 있습니다.

1. **진입**: 사용자가 대시보드의 학습 맵(Learning Map)에서 잠금 해제된 스테이지를 클릭하여 `/stage/[stageId]`로 진입합니다.
2. **로딩**: 클라이언트(page.tsx)에서 `GET /api/stages/[stageId]`를 호출하여 `StageSession` (해당 스테이지 정보 + 관련 문제들)을 불러옵니다.
3. **인터랙션**: 현재는 `questions[0]` 하나만 렌더링되며, 사용자는 `CandleChart`에서 캔들을 클릭(선택)합니다.
4. **제출 및 채점**: `QuestionPanel`의 Submit 버튼을 누르면 `POST /api/answers`로 채점 요청을 보내고, 백엔드 도메인 로직이 채점 및 피드백 텍스트를 반환합니다.
5. **피드백 노출**: 반환된 텍스트가 `FeedbackBox`에 노출됩니다.
6. **(현재 누락된 부분)**: 이후 스테이지를 종료하거나, 다음 문제로 넘어가거나, 진행도(Progress)를 저장하는 등 후속 조치에 대한 UI 요소 및 API 연동이 없습니다.

---

> [!WARNING]
> 현재 시스템은 "한 문제를 풀고 피드백을 읽는다"는 가장 작은 기능 단위(MVP)만 구현되어 있어, **학습의 연속성(Flow)**이 크게 떨어지는 치명적인 UX 문제를 안고 있습니다.

## 직관성/편의성 개선 방안 (UX Improvements)

듀오링고(Duolingo)처럼 직관적이고 끊김 없는 학습 경험을 제공하기 위해 다음 3가지 개선 방안을 제안합니다.

1. **인-스테이지 연속 풀이 (Multi-Question Flow)**
   - 한 스테이지는 여러 개의 문제(`questionCount`)로 구성될 수 있습니다. 정답을 맞힌 후 대시보드로 쫓겨나는 대신, "다음 문제" 버튼을 통해 **스테이지 내에서 페이지 새로고침 없이 연속으로 문제를 풀 수 있어야** 합니다.
2. **시각적 정답 피드백 (Visual Chart Highlighting)**
   - 텍스트로만 "틀렸습니다"라고 말해주는 것은 직관성이 떨어집니다. 사용자가 제출한 후, **차트 자체에 정답 캔들(초록색 화살표)과 오답 캔들(빨간색 X 표시)을 시각적으로 하이라이트**해주어야 학습 효과가 극대화됩니다.
3. **학습 완료 후 흐름 분기 (Stage Clear & Next Stage Navigation)**
   - 스테이지의 모든 문제를 다 풀었을 때 "스테이지 클리어" 화면(모달 등)을 띄워 성취감을 줍니다.
   - 대시보드로 돌아갈 수 있는 옵션과 함께, 즉시 **다음 스테이지로 곧바로 진입할 수 있는 "Next Stage" 버튼**을 제공해 학습 흐름이 끊기지 않게 합니다.
   - 이 시점에 `POST /api/progress/stage-complete` API를 호출해 진행도를 확실히 저장합니다.

---

## 체계적인 기술적 구현 방법 (Proposed Implementation Plan)

위 UX 개선 방안을 실제 시스템에 적용하기 위한 프론트엔드 및 백엔드 기술 구현 방안입니다.

### 1. 다중 문제 풀이 (Multi-Question Flow) 구현
- **파일**: `src/app/stage/[stageId]/page.tsx`
- **구현 방법**:
  - `const [currentIndex, setCurrentIndex] = useState(0);` 상태를 추가합니다.
  - 현재 문제를 `const question = stageSession.questions[currentIndex];`로 동적으로 맵핑합니다.
  - `FeedbackBox`에 `onNext` Props를 추가하고, 사용자가 이 버튼을 누르면 `setCurrentIndex(prev => prev + 1)`을 실행하여 다음 문제를 화면에 그립니다.
  - 다음 문제로 넘어갈 때 `selectedIndex`와 `feedback` 상태는 `null`로 초기화합니다.

### 2. 컴포넌트 하이라이팅 (Visual Feedback)
- **파일**: `src/components/chart/CandleChart.tsx` (및 구현체 `src/components/CandleChart.tsx`)
- **구현 방법**:
  - `CandleChart`에 `correctIndex`와 `isWrong` Props를 추가합니다. (채점 결과에 따라 부모 `page.tsx`에서 전달)
  - TradingView Lightweight Charts API의 `setMarkers`를 활용합니다.
  - `isWrong`이 `true`일 경우, 사용자가 선택한 `selectedIndex` 캔들 위에 붉은 마커(Red X)를 띄웁니다.
  - 정답이 공개된 경우(채점 후), `correctIndex` 캔들 위에 초록색 마커(Green Arrow Up)를 띄워 직관적인 정답 확인을 돕습니다.

### 3. 스테이지 종료 및 진행도 저장
- **파일**: `src/app/api/progress/stage-complete/route.ts` 및 `page.tsx`
- **구현 방법**:
  - **API 구현**: 사용자가 스테이지를 완료하면 이 API를 호출해 DB(또는 Mock data)의 `stage.status`를 `completed`로 변경합니다. 응답으로 `nextStageId`를 함께 반환합니다.
  - **UI 구현**: `currentIndex`가 마지막 문제에 도달하여 제출을 완료했을 때, 팝업(오버레이)을 띄웁니다.
  - 이 팝업에는 완료 API 응답을 받아 `[← 대시보드로]` 버튼과 `[다음 스테이지 시작하기 →]` 버튼을 제공합니다. 다음 스테이지 버튼을 누르면 `router.push("/stage/{nextStageId}")`를 통해 화면이 부드럽게 전환됩니다.

## User Review Required

위 개선 방안을 통해 현재 뚝뚝 끊기는 스테이지 진행이 듀오링고처럼 자연스럽고 매끄러워집니다. 
이 구현 계획에 동의하신다면 **승인(Proceed)**해 주시거나, 추가하고 싶은 기능(예: 재도전 기회 횟수 제한 등)이 있다면 피드백을 남겨주세요! 승인하시면 코딩을 시작하여 화면을 개선해 보겠습니다.
