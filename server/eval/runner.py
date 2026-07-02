# 使用方式：
#cd server && python -m eval.runner --version 1.0
#cd server && python -m eval.runner --version 1.1
#cd server && python -m eval.runner --compare #对比两个版本

# yaml可以将 YAML 文件的结构转化为 Python 原生的数据结构（如字典和列表）
import yaml
import argparse
import asyncio
from eval.scorers import score_response
from services.chat_service import build_and_stream_chat

async def run_single_case(case:dict,prompt_version:str)->dict:
    """
    调用内部chat逻辑拿到完整回复+souces
    """
    # 1. 提取当前用例的参数
    user_message = case["input"]
    persona = case.get("persona", "sophie")
    session_id = f"eval_session_{case['id']}" # 确保每个测试用例隔离记忆
    
    # 2. 直接调用封装好的方法，拿到生成器 (generate) 和引用来源 (sources)
    generate, sources = build_and_stream_chat(
        user_message=user_message,
        persona=persona,
        session_id=session_id,
        prompt_version=prompt_version
    )
    
    # 3. 遍历生成器，将流式的 chunk 拼接为完整字符串
    response_text = "".join([chunk for chunk in generate()])
    
    # 4. 返回字典供后续打分器使用
    return {
        "response_text": response_text,
        "sources": sources
    }
   


async def run_eval(prompt_version:str)->dict:
    """
    1. 读取所有测试用例
    2. 遍历每个测试用例，调用run_single_case拿到完整回复+souces
    3. 调用score_response对每个测试用例的回复进行评分
    4. 返回所有测试用例的评分结果
    """
    with open("eval/test_cases.yaml","r",encoding="utf-8") as f:
        test_data=yaml.safe_load(f)
   
    cases = test_data.get("cases",[])
    report ={
        "total":len(cases),
        "passed":0,
        "failed_cases":[]
    }

    for case in cases:
        res= await run_single_case(case,prompt_version)
        score=score_response(case,res["response_text"],res["sources"])

        if score["passed"]:
            report["passed"]+=1
        else:
            report["failed_cases"].append(case)

    await print_report(report)
    return report


async def print_report(report:dict):
    """终端打印通过率+失败用例详情"""
    print("\n" + "="*40)
    print(f"🎯 评测报告 | 总数: {report['total']} | 通过: {report['passed']} | 失败: {len(report['failed_cases'])}")
    print("="*40)
    if report['failed_cases']:
        print("🚨 失败详情:")
        for fail in report['failed_cases']:
            print(f"  [{fail['id']}] {fail['input']}")
            print(f"  原因: {', '.join(fail['reasons'])}")
            print(f"  实际输出: {fail['actual_text'][:100]}...\n")


if __name__ == "__main__":
    # 运行此文件解析命令行参数
    parser = argparse.ArgumentParser(description="Run evaluation for chat responses.")
    parser.add_argument("--version", type=str, default="1.0", help="Specify the prompt version to evaluate.")
    parser.add_argument("--compare", action="store_true", help="Compare two versions of prompts.")
    args = parser.parse_args()

    if args.compare:
        # Implement comparison logic here
        print("Comparison feature is not yet implemented.")
    else:
        asyncio.run(run_eval(args.version))