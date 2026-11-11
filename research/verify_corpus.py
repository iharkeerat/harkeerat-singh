"""Structure-only audit of supplied exploratory data. It does not validate source truth."""
import csv
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit

HERE = Path(__file__).resolve().parent

def load(name, required):
    with (HERE / "data" / name).open(newline="", encoding="utf-8-sig") as f:
        reader=csv.DictReader(f)
        missing=set(required)-set(reader.fieldnames or ())
        if missing: raise ValueError(f"{name}: missing columns {sorted(missing)}")
        return list(reader)

def urlkey(url):
    if not url: return ""
    p=urlsplit(url.strip())
    if p.scheme!="https" or not p.netloc: raise ValueError(f"Invalid source URL: {url}")
    path=p.path.rstrip("/")
    if path.endswith("/amp/1"):path=path[:-6]
    elif path.endswith("/amp"):path=path[:-4]
    return p.netloc.lower()+path

def main():
    diag=load("diagnostic_claims_12.csv",["id","source_comparison_code","article_url"])
    grid=load("outlet_event_grid_10.csv",["event","outlet","core_outcome_code","page_type","article_url"])
    assert len(diag)==12 and len(grid)==10
    assert len({r["id"] for r in diag})==12
    assert len({(r["event"],r["outlet"]) for r in grid})==10
    diag_codes=Counter(r["source_comparison_code"] for r in diag)
    grid_codes=Counter(r["core_outcome_code"] for r in grid)
    assert diag_codes=={"ALIGNED":8,"UNWARRANTED_COMPLETION":2,"DIRECT_CONTRADICTION":1,"MIXED_HEADLINE_UPGRADE":1}
    assert grid_codes=={"ALIGNED":4,"ALIGNED_WITH_QUALIFIER":3,"DIRECT_CONTRADICTION":1,"NOT_CODED":1,"ALIGNED_CANNOT_FREEZE":1}
    page_types=Counter(r["page_type"] for r in grid)
    assert page_types=={"STANDALONE":8,"ROLLING_LIVE_BLOG":1,"NOT_LOCATED":1}
    missing=[r for r in grid if not r["article_url"]]
    assert len(missing)==1 and missing[0]["core_outcome_code"]=="NOT_CODED"
    a={urlkey(r["article_url"]) for r in diag if r["article_url"]}
    b={urlkey(r["article_url"]) for r in grid if r["article_url"]}
    overlap=len(a & b)
    assert overlap==4, f"Article overlap changed: {overlap}"
    print("PASS: 12 diagnostic comparisons; 10 retrospective slots.")
    print("PASS: expected code distributions, 8 standalone reports, 1 rolling blog, 1 missing slot.")
    print("PASS: 4 cross-dataset overlapping article URLs.")
    print("NOT TESTED: article truth, media-error prevalence, human agreement, archival provenance.")

if __name__=="__main__":
    main()
