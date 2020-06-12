/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package pkg8.puzzle;

import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.PriorityQueue;
import java.util.Set;
import java.util.Stack;/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import pk8.puzzle.BoardControl;

/**
 *
 * @author KARVENDHAN GOVINDHAN
 */
public class Solvers {
    public static enum SOLVE_METHOD{A_STAR, DFS};
   
    //global variables needed for DFS
    private static final Map<String, byte[]> dfs_parent = new HashMap<>();
    private static final Set<String> dfs_vis = new HashSet<>();
   
    //to count the number of expanded nodes
    public static long times;
   
    //solve the current position with A* search
    public static Map<String, byte[]> aStar(byte[] current){
        PriorityQueue<State> q = new PriorityQueue<>();
        Map<String, Integer> dist = new HashMap<>();
        Map<String, byte[]> parent = new HashMap<>();
       
        times = 0;
       
        //intialize the distance of the current state to be 0
        dist.put(stringify(current), 0);
       
        //add the current state to the front of the states queue
        q.add(new State(current, 0));
       
        //A* Algorithm ...
        while(!q.isEmpty()){
            State crnt = q.poll();
            times++;
            if(Arrays.equals(crnt.getBoard(), BoardControl.GOAL)) break;            
            crnt.getNextStates().stream().filter((child) -> (dist.getOrDefault(stringify(child.getBoard()), Integer.MAX_VALUE) > child.getCost())).map((child) -> {
                parent.put(stringify(child.getBoard()), crnt.getBoard());
                return child;
            }).map((child) -> {
                dist.put(stringify(child.getBoard()), child.getCost());
                return child;
            }).forEachOrdered((child) -> {
                q.add(child);
            });
        }
       
        return parent;
    }
   
    //Solve the game with DFS (Very very very inefficient)
    //this method uses a stack to simulate the recursion, I had problems implementing deep recursion in java
    public static Map<String, byte[]> dfs(byte[] current){
        Stack<State> stack = new Stack<>();
        Map<String, byte[]> parent = new HashMap<>();
        Set<String> vis = new HashSet<>();
       
        times = 0;
       
        //add the current state to the front of the states queue
        stack.push(new State(current, 0));
       
        //the simlated recursion part
        while(!stack.isEmpty()){
            state crnt = stack.pop();
            boolean add = vis.add(stringify(crnt.getBoard()));
            times++;
            if(Arrays.equals(crnt.getBoard(), BoardControl.GOAL)) break;            
            crnt.getNextStates().stream().filter((child) -> !(vis.contains(stringify(child.getBoard())))).map((child) -> {
                parent.put(stringify(child.getBoard()), crnt.getBoard());
                return child;
            }).forEachOrdered((child) -> {
                stack.push(child);
            });
        }
       
        return parent;
    }
   
    //takes a byte array and returns it as a string for the map to hash
    //never hash arrays in java, they almost always return different hash values
    public static String stringify(byte[] arr){
        String str = "";
        for(int i = 0 ; i < arr.length ; ++i){
            str += String.valueOf(arr[i]);
        }
        return str;
    }
   
}

