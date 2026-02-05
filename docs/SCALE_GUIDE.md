# Galaxy Tab S7+ 세로(portrait) 스케일 통일 가이드

전체 스케일 기준(rem)을 하나로 맞춰 확대/축소·화면 크기 변화 시 레이아웃과 컴포넌트가 **같은 비율**로 반응하도록 하는 가이드입니다.

---

## 1. 적용된 전역 CSS (global.css)

```css
/* 전역 스케일 기준 */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
}

:root {
  /* Galaxy Tab S7+ portrait 1752×2800 기준, 확대/축소 시 동일 비율 */
  --base: clamp(15px, 1.6vh, 18px);
  --radius-btn: 0.75rem;
  --radius-card: 1rem;
  --shadow-card: 0 0.125rem 0.5rem rgba(30, 41, 59, 0.08);
  --touch-min-height: 3rem;  /* 터치 UI 버튼 최소 높이 */
  /* ... 기타 디자인 토큰 */
}

html {
  font-size: var(--base);
  scrollbar-width: thin;
  overflow: hidden;
}

body {
  margin: 0;
  height: 100%;
  /* ... */
}

#app {
  min-height: 100%;
  height: 100%;
  overflow: hidden;
  /* ... */
}
```

- **높이 연쇄**: `html` → `body` → `#app` 모두 `height: 100%`로 정의되어 있어, 내부에서 `height: 100%` 사용 시 기준이 명확합니다.
- **rem 기준**: `html { font-size: var(--base); }`로 전역 1rem이 `--base`(clamp(15px, 1.6vh, 18px))에 묶여, 확대/축소 시 모든 rem 단위가 같은 비율로 움직입니다.

---

## 2. px → rem 전환 예시

### 2.1 페이지(뷰) 예시 (EntryRegisterView)

| 기존 (px) | 전환 (rem) | 비고 |
|-----------|------------|------|
| `padding: 20px 10px` | `padding: 1.25rem 0.625rem` | 16px=1rem 기준 시 20≈1.25rem |
| `gap: 16px` | `gap: 1rem` | |
| `max-width: 760px` | `max-width: min(47.5rem, 100%)` | 760/16≈47.5 |
| `height: 60px` (버튼/입력) | `min-height: 3rem; height: 3.75rem` | 터치 최소 3rem |
| `font-size: 16px` | `font-size: clamp(1rem, 1.2vh, 1.125rem)` | 폰트는 clamp 권장 |
| `padding: 12px 24px` (버튼) | `padding: 0.75rem 1.5rem` + `min-height: 3rem` | |

### 2.2 컴포넌트 예시 (ParkingMap)

| 기존 (px) | 전환 (rem) |
|-----------|------------|
| `--map-padding: clamp(12px, 2.6vw, 16px)` | `--map-padding: clamp(0.75rem, 1.5vh, 1rem)` |
| 그리드 칸 `85px`, `110px` | `--slot-w: 5.3125rem; --slot-h: 6.875rem` 사용 |
| `max-width: 615px` | `max-width: min(38.4375rem, 92%)` |
| `font-size: 11px` | `font-size: clamp(0.6875rem, 1.2vh, 0.875rem)` |
| `padding: 6px 8px 8px` | `padding: 0.375rem 0.5rem 0.5rem` |

**변환 공식**: `px / 16 ≈ rem` (기준 1rem=16px일 때). 실제로는 `html`이 `--base`이므로 1rem은 15~18px 구간으로 변동됩니다.

---

## 3. 레이아웃 리팩토링 예시 (flex/grid)

### 3.1 페이지 컨테이너 (flex, height 연쇄)

```css
.entry-register-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.top-section {
  flex: 0 0 auto;   /* 고정 높이, 잘리지 않음 */
  padding: 1.625rem 0 0 4.375rem;
}

.middle-section {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;  /* 내용만 스크롤 */
}

.bottom-section {
  flex: 0 0 auto;   /* 버튼 영역 항상 노출 */
  padding: 1.25rem;
  gap: 1rem;
}
```

- **position: absolute/fixed**는 네비(관리자 버튼 등)처럼 꼭 필요할 때만 사용.
- **transform: scale()**로 전체 축소/확대하지 않기. 스케일은 `html { font-size: var(--base) }` + rem으로만 처리.

### 3.2 컴포넌트 그리드 (grid + rem)

```css
.parking-grid {
  display: grid;
  grid-template-columns: repeat(4, var(--slot-w));
}
.parking-grid.top-grid {
  grid-template-rows: repeat(2, var(--slot-h));
}
```

- 너비/높이는 `min(42rem, 100%)` 또는 `var(--slot-w)` 같은 **rem/변수**로 통일.

---

## 4. “컴포넌트만 따로 움직이는” 문제 점검 체크리스트

다음 항목을 순서대로 확인하세요.

| # | 항목 | 확인 방법 | 조치 |
|---|------|-----------|------|
| 1 | **px/rem/vh 혼용** | 해당 컴포넌트/페이지에서 `px` 검색 | 크기·간격은 rem, 폰트는 `clamp(1rem, 1.2vh, 1.25rem)` 패턴으로 통일 |
| 2 | **absolute/fixed 사용** | `position: absolute` / `position: fixed` 검색 | 레이아웃용이면 flex/grid로 대체, 꼭 필요할 때만 유지 |
| 3 | **조상에 transform 존재** | 해당 요소의 조상에 `transform` 검색 | `transform: scale()` 제거, `translate`는 꼭 필요할 때만 |
| 4 | **height: 100% 부모 높이 미정** | `height: 100%` 사용 요소의 부모 체인 확인 | `html`, `body`, `#app` 및 중간 컨테이너에 `height: 100%` 또는 flex로 높이 보장 |
| 5 | **컴포넌트 내부 font-size 고정 px** | 컴포넌트 스타일에서 `font-size: Npx` 검색 | `clamp(1rem, 1.2vh, 1.25rem)` 또는 rem으로 변경 |

---

## 5. 문제 발생 시 디버깅 순서

1. **전역 기준 확인**
   - `html { font-size: var(--base); }` 적용 여부
   - `:root`의 `--base`가 `clamp(15px, 1.6vh, 18px)`인지

2. **높이 연쇄 확인**
   - `html`, `body`, `#app` 모두 `height: 100%`
   - 해당 뷰 루트(예: `.entry-register-container`)에 `height: 100%` 적용 여부

3. **의심 컴포넌트/뷰**
   - 위 체크리스트 1~5항 순서로 점검
   - 특히 해당 영역만 px, vw, vh로 크기를 잡고 있으면 rem 또는 `clamp(…rem, …vh, …rem)`으로 통일

4. **transform / position**
   - 레이아웃이 틀어지면 조상의 `transform`, `position: absolute/fixed` 사용처를 줄이고 flex/grid로 재구성

5. **실기기에서 확인**
   - Galaxy Tab S7+ 세로(1752×2800)에서 확대/축소 시 전체가 같은 비율로 움직이는지 확인

---

## 6. 요약

- **전역**: `box-sizing: border-box`, `html/body/#app { height: 100% }`, `:root { --base }`, `html { font-size: var(--base) }`.
- **스타일**: px 최소화, rem + 필요 시 `clamp(…rem, …vh, …rem)` 통일, 터치 버튼 `min-height: 3rem`.
- **레이아웃**: flex/grid 우선, absolute/fixed·transform은 꼭 필요할 때만, `transform: scale()` 금지.
- **디버깅**: 전역 rem → 높이 연쇄 → px/rem/position/transform/폰트 고정값 순으로 체크리스트 점검.
