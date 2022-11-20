function twoSum(nums, target){
    let i=0;
    for (let num of nums){
        if (i===0) continue;
        if (target === (num[i--]+ num)){
            return [i--, i];
        }
        console.log(i)
        i++;
    }
};

twoSum([2,7,11,15], 9)