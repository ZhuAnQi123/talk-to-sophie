
# from server.eval.test_cases import BaseScorer

def score_response(case:dict,response_text:str,sources:list)->dict:
    """
    目标返回：{
        "passed":True/False,
        "detail":{
            "must_contain": {"React":True/False,"TypeScripe":True/False},
            "must_not_contain":{"Java":True/False},
            "should_cite":{"skills-and-stack.md":True/False},
            "within_len_limit":True/False
        }
        "fail_reasons":[]
    }
    """

    expected = case.get("expected", {})

    # 初始化返回结构
    result = {
        "passed": True,
        "detail": {
            "must_contain":{},
            "must_not_contain":{},
            "should_cite":{},
            "within_len_limit":True
        },
        "fail_reasons": []
    }

    if not expected:
        return result  # 如果没有预期结果，直接返回默认的通过结果
    

    # 1. must_contain 检查
    for word in expected.get("must_contain", []):
        passed = word in response_text
        result['detail']['must_contain'][word] = passed
        if not passed:
            result['passed'] = False
            result['fail_reasons'].append(f"Response does not contain required word: '{word}'")
    # 2. must_not_contain 检查
    for word in expected.get("must_not_contain", []):
        passed = word not in response_text
        result['detail']['must_not_contain'][word] = passed
        if not passed:
            result['passed'] = False
            result['fail_reasons'].append(f"Response contains forbidden word: '{word}'")

    # 3. should_cite 检查
    sources_str=str(sources)
    for cite in expected.get("should_cite", []):
        passed = cite in sources_str
        result['detail']['should_cite'][cite] = passed
        if not passed:
            result['passed'] = False
            result['fail_reasons'].append(f"Response does not cite required source: '{cite}'")


    #4. within_len_limit 检查
    max_len = expected.get("max_len", None)
    if max_len is not None:
        passed = len(response_text) <= max_len
        result['detail']['within_len_limit'] = passed
        if not passed:
            result['passed'] = False
            result['fail_reasons'].append(f"Response exceeds maximum length of {max_len} characters.")

    return result


