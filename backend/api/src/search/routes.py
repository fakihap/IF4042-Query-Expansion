from fastapi import APIRouter

from api.src.search.schemas import SearchResponse, SearchRequest, SearchInverted, SearchInvertRequest, SearchInvertResponse

from api.gan_model.infer import generate_expansion, return_inverted

router = APIRouter(prefix="/search", tags=["search"])

@router.post("/", response_model=SearchResponse)
async def start_search(
    search_params: SearchRequest
) -> SearchResponse:
    
    try:
        rank_result = generate_expansion(search_params) # NOTE: for now, its a batch process

        return {
            "query": search_params.query,
            "useStemming": search_params.useStemming,
            "useStopwordElim": search_params.useStopwordElim,
            "tfMode": search_params.tfMode,
            "useIDF": search_params.useIDF,
            "useNormalize": search_params.useNormalize,
            "numberExpansionWords": search_params.numberExpansionWords,
            "result": rank_result
        }

    except Exception as e:
        print(e)
        raise

@router.post("/inverted", response_model=SearchInvertResponse)
async def start_inverted(
    search_params: SearchInvertRequest
) -> SearchInvertResponse:
    
    try:
        result = return_inverted(search_params.document_id)

        return {
            "document_id": search_params.document_id,
            "useStemming": search_params.useStemming,
            "useStopwordElim": search_params.useStopwordElim,
            "tfMode": search_params.tfMode,
            "useIDF": search_params.useIDF,
            "useNormalize": search_params.useNormalize,
            "result": result
        }

    except Exception as e:
        print(e)
        raise



# @router.get("/", response_model=list[SearchResponse])
# async def get_all_queries(
#     service: SearchService = Depends(get_search_service),
# ) -> list[SearchService]:
    
#     try:
#         queries = await service.get_all_queries()

#         return queries
#     except Exception as e:
#         print(e)
#         raise

# @router.get("/{id}", response_model=SearchResponse)
# async def get_query(
#     id: int,
#     service: SearchService = Depends(get_search_service),
# ) -> SearchResponse:
    
#     try:
#         query = await service.get_query(id)

#         return query
#     except Exception as e:
#         print(e)
#         raise
