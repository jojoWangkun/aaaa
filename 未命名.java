import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    
    // 模拟数据库
    private List<Employee> employees = new ArrayList<>();
    private Random random = new Random();
    
    public EmployeeController() {
        // 初始化一些测试数据
        employees.add(new Employee(1, "张三", "高级工程师", "研发部", "工作中", 92, 95));
        employees.add(new Employee(2, "李四", "产品经理", "研发部", "会议中", 88, 88));
        employees.add(new Employee(3, "王五", "销售主管", "销售部", "工作中", 85, 90));
        employees.add(new Employee(4, "赵六", "市场专员", "市场部", "休息中", 76, 75));
        employees.add(new Employee(5, "钱七", "前端开发", "研发部", "工作中", 80, 82));
        employees.add(new Employee(6, "孙八", "销售人员", "销售部", "离线", 72, 68));
    }
    
    // 获取所有员工
    @GetMapping
    public List<Employee> getAllEmployees() {
        return employees;
    }
    
    // 获取单个员工
    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable int id) {
        return employees.stream()
                .filter(emp -> emp.getId() == id)
                .findFirst()
                .orElse(null);
    }
    
    // 添加新员工
    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        int newId = employees.stream()
                .mapToInt(Employee::getId)
                .max()
                .orElse(0) + 1;
        employee.setId(newId);
        employees.add(employee);
        return employee;
    }
    
    // 更新员工信息
    @PutMapping("/{id}")
    public Employee updateEmployee(@PathVariable int id, @RequestBody Employee employee) {
        for (int i = 0; i < employees.size(); i++) {
            if (employees.get(i).getId() == id) {
                employee.setId(id);
                employees.set(i, employee);
                return employee;
            }
        }
        return null;
    }
    
    // 删除员工
    @DeleteMapping("/{id}")
    public void deleteEmployee(@PathVariable int id) {
        employees.removeIf(emp -> emp.getId() == id);
    }
    
    // 获取统计数据
    @GetMapping("/stats")
    public Stats getStats() {
        int onlineCount = random.nextInt(10) + 15;
        int taskCompletion = random.nextInt(20) + 70;
        int avgCompetence = random.nextInt(10) + 75;
        int alertCount = random.nextInt(5);
        
        return new Stats(onlineCount, taskCompletion, avgCompetence, alertCount);
    }
}

// 员工实体类
class Employee {
    private int id;
    private String name;
    private String position;
    private String department;
    private String status;
    private int competence;
    private int completion;
    
    // 构造函数、getter和setter省略
}

// 统计数据类
class Stats {
    private int onlineCount;
    private int taskCompletion;
    private int avgCompetence;
    private int alertCount;
    
    // 构造函数、getter和setter省略
}
