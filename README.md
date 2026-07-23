# 系統分析與設計－第 8 組期中專案成果導覽

專案名稱：同人誌販售會攤位管理系統「攤集」

本頁是期中專案的單一入口，依照「問題與範圍 → 需求 → 分析模型 → 可操作原型 → 追溯與驗收 → 限制與下一步」整理。  
期中影片錄製時，從本頁依序開啟材料即可。

## 期中影片快速入口

1. [專案章程：問題、角色、系統範圍](0708_Project_Charter_Studio/project_charter_v2.md)
2. [需求來源表：訪談與章程證據](0713_Requirements_Code_Agent/requirements_source_table.md)
3. [需求優先順序：MoSCoW 與本期切片](0714_User_Stories_Acceptance_Implementation/requirements_priority.md)
4. [使用案例圖](0720_Use_Case_Process_Modeling_Implementation/use_case_diagram.png)
5. [AS-IS 現況流程](0720_Use_Case_Process_Modeling_Implementation/as_is_process.png)
6. [TO-BE 目標流程](0720_Use_Case_Process_Modeling_Implementation/to_be_process.png)
7. [最新版可操作原型](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/index.html)
8. [需求追溯矩陣](0714_User_Stories_Acceptance_Implementation/traceability_matrix_draft.md)
9. [最新版手動驗收報告](0720_Use_Case_Process_Modeling_Implementation/manual_acceptance_test.md)
10. [驗收畫面證據總覽](0720_Use_Case_Process_Modeling_Implementation/evidence/README.md)
11. [目前限制、未完成項目與下一步](0720_Use_Case_Process_Modeling_Implementation/README.md#6-已知限制與待確認問題)
12. [生成式 AI／程式碼代理使用與人工修正紀錄](0720_Use_Case_Process_Modeling_Implementation/ai_code_agent_log.md)

> 錄影應使用 `revised_or_third_working_slice`。前兩個 working slice 是開發歷史，不是目前展示版本。

## 依評分項目導覽

| 評分項目 | 建議展示材料 | 可證明的內容 |
|---|---|---|
| 問題定義與系統範圍 | [專案章程 v2](0708_Project_Charter_Studio/project_charter_v2.md)、[利害關係人與可行性](0707_Stakeholder_Feasibility/stakeholder_feasibility_v1.md) | 核心問題、目標角色、本期範圍內外 |
| 需求成果 | [需求來源表](0713_Requirements_Code_Agent/requirements_source_table.md)、[使用者故事](0714_User_Stories_Acceptance_Implementation/user_stories.md)、[功能性需求](0714_User_Stories_Acceptance_Implementation/functional_requirements.md)、[需求優先順序](0714_User_Stories_Acceptance_Implementation/requirements_priority.md)、[驗收條件](0714_User_Stories_Acceptance_Implementation/acceptance_criteria.md) | 需求來源、價值、排序理由與驗收依據 |
| 分析模型 | [使用案例圖](0720_Use_Case_Process_Modeling_Implementation/use_case_diagram.png)、[使用案例完整描述](0720_Use_Case_Process_Modeling_Implementation/use_case_descriptions.md)、[AS-IS](0720_Use_Case_Process_Modeling_Implementation/as_is_process.png)、[TO-BE](0720_Use_Case_Process_Modeling_Implementation/to_be_process.png)、[資料交換表](0720_Use_Case_Process_Modeling_Implementation/process_data_exchange.md) | 角色、主要／替代／例外流程與資料交換 |
| 系統實作展示 | [最新版可操作原型](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/index.html)、[操作說明](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/TASK12_README.md) | 送件、審核、退回、回查與補正重送 |
| 需求、模型與實作一致性 | [需求追溯矩陣](0714_User_Stories_Acceptance_Implementation/traceability_matrix_draft.md)、[模型一致性矩陣](0720_Use_Case_Process_Modeling_Implementation/model_consistency_matrix.md)、[實作待辦](0720_Use_Case_Process_Modeling_Implementation/implementation_backlog.md) | 需求來源到故事、需求、模型、畫面、驗收與測試的完整鏈 |
| 驗收與測試 | [最新版手動驗收報告](0720_Use_Case_Process_Modeling_Implementation/manual_acceptance_test.md)、[驗收證據](0720_Use_Case_Process_Modeling_Implementation/evidence/README.md)、[領域測試程式](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/domain.test.js) | 正常、替代、例外情境及修正後回歸結果 |
| AI 使用紀錄 | [最新 AI 程式碼代理紀錄](0720_Use_Case_Process_Modeling_Implementation/ai_code_agent_log.md)、[前一階段 AI 紀錄](0714_User_Stories_Acceptance_Implementation/ai_code_agent_log.md) | 工具產出、採用／不採用內容與人工判斷 |
| 限制與下一步 | [0720 成果說明第 5～6 節](0720_Use_Case_Process_Modeling_Implementation/README.md#5-驗收結果) | 未完成 FR-06／FR-07、資料保存、正式登入與待確認規則 |

## 需求成果完整索引

### 需求來源

- [訪談指引](0713_Requirements_Code_Agent/interview_guide.md)
- [訪談紀錄](0713_Requirements_Code_Agent/interview_notes.md)
- [需求來源表](0713_Requirements_Code_Agent/requirements_source_table.md)
- [候選需求](0713_Requirements_Code_Agent/candidate_requirements.md)
- [第一階段需求與實作總覽](0713_Requirements_Code_Agent/README.md)

### 需求規格與決策

- [使用者故事](0714_User_Stories_Acceptance_Implementation/user_stories.md)
- [功能性需求](0714_User_Stories_Acceptance_Implementation/functional_requirements.md)
- [非功能性需求](0714_User_Stories_Acceptance_Implementation/non_functional_requirements.md)
- [業務規則與資料限制](0714_User_Stories_Acceptance_Implementation/business_rules_data_constraints.md)
- [需求優先順序](0714_User_Stories_Acceptance_Implementation/requirements_priority.md)
- [驗收條件](0714_User_Stories_Acceptance_Implementation/acceptance_criteria.md)
- [待確認與已決策事項](0714_User_Stories_Acceptance_Implementation/decisions_required.md)
- [需求品質檢查](0714_User_Stories_Acceptance_Implementation/requirements_quality_review.md)
- [需求套件草稿](0714_User_Stories_Acceptance_Implementation/requirements_package_draft.md)
- [需求到畫面對照](0714_User_Stories_Acceptance_Implementation/requirements_to_screen.md)

## 分析模型完整索引

### 使用案例

- [分析基準](0720_Use_Case_Process_Modeling_Implementation/analysis_baseline.md)
- [參與者目標矩陣](0720_Use_Case_Process_Modeling_Implementation/actor_goal_matrix.md)
- [使用案例清單](0720_Use_Case_Process_Modeling_Implementation/use_case_inventory.md)
- [使用案例圖 PNG](0720_Use_Case_Process_Modeling_Implementation/use_case_diagram.png)
- [使用案例圖 SVG](0720_Use_Case_Process_Modeling_Implementation/use_case_diagram_source/use_case_diagram.svg)
- [使用案例圖 Mermaid 原始檔](0720_Use_Case_Process_Modeling_Implementation/use_case_diagram_source/use_case_diagram.mmd)
- [使用案例完整描述](0720_Use_Case_Process_Modeling_Implementation/use_case_descriptions.md)

### 流程與資料

- [AS-IS 現況流程 PNG](0720_Use_Case_Process_Modeling_Implementation/as_is_process.png)
- [TO-BE 目標流程 PNG](0720_Use_Case_Process_Modeling_Implementation/to_be_process.png)
- [AS-IS 流程文字說明](0720_Use_Case_Process_Modeling_Implementation/process_model_sources/as_is_process_description.md)
- [TO-BE 流程文字說明](0720_Use_Case_Process_Modeling_Implementation/process_model_sources/to_be_process_description.md)
- [流程問題與改善對照](0720_Use_Case_Process_Modeling_Implementation/process_problem_improvement.md)
- [流程資料交換表](0720_Use_Case_Process_Modeling_Implementation/process_data_exchange.md)
- [流程模型原始檔說明](0720_Use_Case_Process_Modeling_Implementation/process_model_sources/README.md)
- [模型一致性矩陣](0720_Use_Case_Process_Modeling_Implementation/model_consistency_matrix.md)

## 實作與驗收完整索引

### 最新展示版本

- [開啟最新版可操作原型](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/index.html)
- [最新版原型操作與修正說明](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/TASK12_README.md)
- [領域邏輯測試](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/domain.test.js)
- [UI 自動驗收測試](0720_Use_Case_Process_Modeling_Implementation/revised_or_third_working_slice/ui.acceptance.test.js)
- [最新版手動驗收報告](0720_Use_Case_Process_Modeling_Implementation/manual_acceptance_test.md)
- [實作與驗收證據總覽](0720_Use_Case_Process_Modeling_Implementation/evidence/README.md)
- [原始手動驗收結果 JSON](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/manual_results_raw.json)

### 代表性畫面證據

- [正常流程：空白意見通過](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/MAT-13-01_主要流程_空白意見通過.png)
- [正常流程：補正重送回待審](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/MAT-13-02_主要流程_補正重送回待審.png)
- [替代流程：有效意見退回](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/MAT-13-03_替代流程_有效意見退回.png)
- [替代流程：填寫選填意見後通過](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/MAT-13-04_替代流程_填寫選填意見通過.png)
- [例外流程：空字串退回被拒絕](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/MAT-13-05_例外流程_空字串退回.png)
- [例外流程：全空白字元退回被拒絕](0720_Use_Case_Process_Modeling_Implementation/evidence/task13_manual_acceptance/MAT-13-06_例外流程_全空白字元退回.png)

### 開發歷史版本

- [第一個可操作切片](0713_Requirements_Code_Agent/first_working_slice/index.html)
- [第一切片驗收報告](0713_Requirements_Code_Agent/acceptance_report.md)
- [第二個可操作切片](0714_User_Stories_Acceptance_Implementation/revised_or_second_working_slice/index.html)
- [第二切片驗收與證據總覽](0714_User_Stories_Acceptance_Implementation/evidence/README.md)

## AI、實作任務與人工修正

- [第一階段程式碼代理任務書](0713_Requirements_Code_Agent/code_agent_implementation_brief.md)
- [第一階段程式碼代理紀錄](0713_Requirements_Code_Agent/code_agent_log.md)
- [第二階段更新後任務書](0714_User_Stories_Acceptance_Implementation/updated_code_agent_brief.md)
- [第二階段 AI 程式碼代理紀錄](0714_User_Stories_Acceptance_Implementation/ai_code_agent_log.md)
- [第三階段更新後任務書](0720_Use_Case_Process_Modeling_Implementation/updated_code_agent_brief.md)
- [第三階段 AI 程式碼代理紀錄](0720_Use_Case_Process_Modeling_Implementation/ai_code_agent_log.md)
- [模型驅動實作待辦](0720_Use_Case_Process_Modeling_Implementation/implementation_backlog.md)

## 目前完成範圍

目前原型已涵蓋：

- FR-01～FR-04：申請、驗證、編號／狀態、同步待審。
- FR-05：主辦方通過或附理由退回。
- FR-08：攤主查看結果並以相同編號補正重送。
- 正常、替代與例外流程的手動驗收證據。

目前尚未完成：

- FR-06：攤位配置與重複格位檢查。
- FR-07：攤位搜尋與靜態地圖。
- 正式登入、後端、資料庫、跨工作階段保存與外部通知。

詳情請見 [0720 最新成果說明](0720_Use_Case_Process_Modeling_Implementation/README.md)。
