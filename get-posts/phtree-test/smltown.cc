#include <string>
#include <unordered_map>
#include "phtree/phtree.h"
#include "phtree/phtree_multimap.h"



using namespace improbable::phtree;

struct Post {
    std::string                             id;
    v16::Entry<2, Post*, scalar_64_t>*      entry;
};

using PostMap = std::unordered_map<std::string, Post*>;
using PhTreeMM = PhTreeMultiMap<2, Post*>;


int get_posts() {
    
    return 0;
}

int add_post(PostMap& postMap, PhTreeMM& phTree, Post& post, PhPoint<2>& point) {
    auto pair = postMap.emplace(post.id, &post);
    if (!pair.second) {
        return -1;
    }
    auto pair = phTree.try_emplace_e(point, &post);
    if (!pair.second) {
        return -1;
    }
    auto& entry = pair.first;
    return 0;
}

int main() {
    
    PostMap pMap;
    auto tree = PhTreeMM();
    return 0;
}