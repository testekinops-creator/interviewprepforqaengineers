/*
 * Full, readable code examples for questions that were previously stored as
 * compressed one-line snippets. Prompt matching also updates Top 200 copies.
 */
var defined_sections = defined_sections || {};

(function () {
  var examples = {
    'Write a Java program to reverse a string.': {
      code: `public static String reverse(String input) {
    if (input == null) {
        return null;
    }

    return new StringBuilder(input).reverse().toString();
}`,
      explanation: 'Handle null before reversing. StringBuilder.reverse keeps the solution short; explain a char-array loop if the interviewer asks for manual logic.'
    },
    'Write a Java program to reverse an integer.': {
      code: `public static int reverseInteger(int number) {
    long reversed = 0;
    int value = Math.abs(number);

    while (value != 0) {
        reversed = reversed * 10 + value % 10;
        value /= 10;
    }

    if (reversed > Integer.MAX_VALUE) {
        throw new ArithmeticException("Integer overflow");
    }
    return number < 0 ? (int) -reversed : (int) reversed;
}`,
      explanation: 'Modulo extracts the last digit and division removes it. A long accumulator prevents a silent overflow while the answer is being built.'
    },
    'Check whether a string is a palindrome.': {
      code: `public static boolean isPalindrome(String input) {
    if (input == null) {
        return false;
    }

    String normalized = input.replaceAll("[^A-Za-z0-9]", "")
                             .toLowerCase();
    int left = 0;
    int right = normalized.length() - 1;

    while (left < right) {
        if (normalized.charAt(left++) != normalized.charAt(right--)) {
            return false;
        }
    }
    return true;
}`,
      explanation: 'Normalize first so punctuation and case do not affect the comparison, then compare mirrored characters with two pointers.'
    },
    'Check whether a number is prime.': {
      code: `public static boolean isPrime(int number) {
    if (number < 2) {
        return false;
    }

    for (int divisor = 2; divisor * divisor <= number; divisor++) {
        if (number % divisor == 0) {
            return false;
        }
    }
    return true;
}`,
      explanation: 'Values below two are not prime. Checking only up to the square root is enough because a larger factor must have a matching smaller factor.'
    },
    'Calculate factorial safely.': {
      code: `public static long factorial(int number) {
    if (number < 0) {
        throw new IllegalArgumentException("Factorial needs a non-negative number");
    }

    long result = 1;
    for (int value = 2; value <= number; value++) {
        result = Math.multiplyExact(result, value);
    }
    return result;
}`,
      explanation: 'The loop is simple and Math.multiplyExact reports long overflow instead of returning a misleading value. Use BigInteger if larger input is required.'
    },
    'Check whether a number is an Armstrong number.': {
      code: `public static boolean isArmstrong(int number) {
    if (number < 0) {
        return false;
    }

    int digits = String.valueOf(number).length();
    int original = number;
    int sum = 0;

    do {
        int digit = number % 10;
        sum += (int) Math.pow(digit, digits);
        number /= 10;
    } while (number > 0);

    return sum == original;
}`,
      explanation: 'Count digits once, then sum each digit raised to that power. A do-while loop also handles zero correctly.'
    },
    'Find duplicate characters in a string.': {
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public static Map<Character, Integer> duplicateCharacters(String input) {
    Map<Character, Integer> counts = new LinkedHashMap<>();
    for (char character : input.toCharArray()) {
        counts.merge(character, 1, Integer::sum);
    }

    Map<Character, Integer> duplicates = new LinkedHashMap<>();
    for (Map.Entry<Character, Integer> entry : counts.entrySet()) {
        if (entry.getValue() > 1) {
            duplicates.put(entry.getKey(), entry.getValue());
        }
    }
    return duplicates;
}`,
      explanation: 'LinkedHashMap keeps the original character order. The first pass counts; the second pass returns only characters with a count greater than one.'
    },
    'Find duplicate numbers in an array.': {
      code: `import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

public static Set<Integer> duplicateNumbers(int[] numbers) {
    Set<Integer> seen = new HashSet<>();
    Set<Integer> duplicates = new LinkedHashSet<>();

    for (int number : numbers) {
        if (!seen.add(number)) {
            duplicates.add(number);
        }
    }
    return duplicates;
}`,
      explanation: 'HashSet gives O(1) average membership checks. LinkedHashSet makes the returned duplicate order stable and readable.'
    },
    'Count the frequency of each character.': {
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public static Map<Character, Integer> characterFrequency(String input) {
    Map<Character, Integer> counts = new LinkedHashMap<>();
    for (char character : input.toCharArray()) {
        counts.merge(character, 1, Integer::sum);
    }
    return counts;
}`,
      explanation: 'A LinkedHashMap preserves encounter order, making the output predictable. Decide before coding whether spaces and case should be normalized.'
    },
    'Count words in a sentence.': {
      code: `public static int countWords(String sentence) {
    if (sentence == null || sentence.trim().isEmpty()) {
        return 0;
    }

    return sentence.trim().split("\\s+").length;
}`,
      explanation: 'Trim first and split on one-or-more whitespace characters, so repeated spaces do not create fake words.'
    },
    'Find the largest and smallest value in an array.': {
      code: `public static int[] minAndMax(int[] numbers) {
    if (numbers == null || numbers.length == 0) {
        throw new IllegalArgumentException("Array must not be empty");
    }

    int minimum = numbers[0];
    int maximum = numbers[0];
    for (int number : numbers) {
        minimum = Math.min(minimum, number);
        maximum = Math.max(maximum, number);
    }
    return new int[] { minimum, maximum };
}`,
      explanation: 'Initialize from the first value, then make one pass through the remaining values. This is O(n) time and O(1) extra space.'
    },
    'Sort an array without mutating the input.': {
      code: `import java.util.Arrays;

public static int[] sortedCopy(int[] input) {
    if (input == null) {
        return null;
    }

    int[] copy = Arrays.copyOf(input, input.length);
    Arrays.sort(copy);
    return copy;
}`,
      explanation: 'Copy before sorting so callers keep their original order. This is a useful interview detail when a method promises not to mutate inputs.'
    },
    'Remove duplicates while preserving array order.': {
      code: `import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;

public static List<Integer> uniqueInOriginalOrder(List<Integer> numbers) {
    if (numbers == null) {
        return List.of();
    }

    return new ArrayList<>(new LinkedHashSet<>(numbers));
}`,
      explanation: 'LinkedHashSet removes duplicates while retaining insertion order; converting back to ArrayList gives a familiar indexed result.'
    },
    'Compare two arrays for equality and for the same elements in any order.': {
      code: `import java.util.Arrays;

public static boolean sameSequence(int[] first, int[] second) {
    return Arrays.equals(first, second);
}

public static boolean sameValuesIgnoringOrder(int[] first, int[] second) {
    int[] firstCopy = Arrays.copyOf(first, first.length);
    int[] secondCopy = Arrays.copyOf(second, second.length);
    Arrays.sort(firstCopy);
    Arrays.sort(secondCopy);
    return Arrays.equals(firstCopy, secondCopy);
}`,
      explanation: 'Arrays.equals checks sequence equality. For order-independent comparison, sort copies so the original arrays remain unchanged and duplicates are still respected.'
    },
    'Find one missing number in a sequence from 1 to n.': {
      code: `public static int missingNumber(int[] numbers, int n) {
    long expectedSum = (long) n * (n + 1) / 2;
    long actualSum = 0;

    for (int number : numbers) {
        actualSum += number;
    }
    return (int) (expectedSum - actualSum);
}`,
      explanation: 'The expected arithmetic sum minus the observed sum gives the missing value. Use long to avoid overflow in the intermediate calculation.'
    },
    'Determine whether a number is even or odd.': {
      code: `public static String parity(int number) {
    if ((number & 1) == 0) {
        return "even";
    }
    return "odd";
}`,
      explanation: 'The last binary bit determines parity. This works for negative numbers as well; modulo two is also acceptable and often easier to explain.'
    },
    'Swap two numbers without a temporary variable.': {
      code: `public static int[] swapWithoutTemporaryVariable(int first, int second) {
    first = first ^ second;
    second = first ^ second;
    first = first ^ second;

    return new int[] { first, second };
}`,
      explanation: 'XOR swapping avoids an extra variable for integer primitives. In production code, prefer a temporary variable because it is clearer and less error-prone.'
    },
    'Reverse the words in a sentence.': {
      code: `public static String reverseWords(String sentence) {
    if (sentence == null || sentence.trim().isEmpty()) {
        return "";
    }

    String[] words = sentence.trim().split("\\s+");
    StringBuilder result = new StringBuilder();
    for (int index = words.length - 1; index >= 0; index--) {
        result.append(words[index]);
        if (index > 0) {
            result.append(' ');
        }
    }
    return result.toString();
}`,
      explanation: 'Split normalized whitespace, iterate backward, and insert one space between output words. Characters inside each word are unchanged.'
    },
    'Return the most frequent number in an array.': {
      code: `import java.util.HashMap;
import java.util.Map;

public static int mostFrequent(int[] numbers) {
    Map<Integer, Integer> counts = new HashMap<>();
    int answer = numbers[0];
    int highestCount = 0;

    for (int number : numbers) {
        int count = counts.merge(number, 1, Integer::sum);
        if (count > highestCount || (count == highestCount && number < answer)) {
            answer = number;
            highestCount = count;
        }
    }
    return answer;
}`,
      explanation: 'Count values as you scan. The tie breaker is explicit, so the result remains deterministic when two numbers have the same frequency.'
    },
    'Find two indexes whose values sum to a target.': {
      code: `import java.util.HashMap;
import java.util.Map;

public static int[] twoSum(int[] numbers, int target) {
    Map<Integer, Integer> indexByValue = new HashMap<>();

    for (int index = 0; index < numbers.length; index++) {
        int complement = target - numbers[index];
        Integer match = indexByValue.get(complement);
        if (match != null) {
            return new int[] { match, index };
        }
        indexByValue.put(numbers[index], index);
    }
    return new int[0];
}`,
      explanation: 'Store each value after checking its complement. This avoids using the same index twice and runs in O(n) time on average.'
    },
    'Move all zeros to the end of an array in-place.': {
      code: `public static void moveZerosToEnd(int[] numbers) {
    int writeIndex = 0;

    for (int number : numbers) {
        if (number != 0) {
            numbers[writeIndex++] = number;
        }
    }

    while (writeIndex < numbers.length) {
        numbers[writeIndex++] = 0;
    }
}`,
      explanation: 'First compact non-zero values in their original order, then fill the remaining positions with zeros. The method uses O(1) extra space.'
    },
    'Validate whether brackets are balanced.': {
      code: `import java.util.ArrayDeque;
import java.util.Deque;

public static boolean hasBalancedBrackets(String input) {
    Deque<Character> stack = new ArrayDeque<>();

    for (char character : input.toCharArray()) {
        if (character == '(' || character == '[' || character == '{') {
            stack.push(character);
        } else if (character == ')' || character == ']' || character == '}') {
            if (stack.isEmpty() || !matches(stack.pop(), character)) {
                return false;
            }
        }
    }
    return stack.isEmpty();
}

private static boolean matches(char open, char close) {
    return (open == '(' && close == ')')
        || (open == '[' && close == ']')
        || (open == '{' && close == '}');
}`,
      explanation: 'A stack records open brackets. Every closing bracket must match the most recent open bracket, and the stack must be empty at the end.'
    },
    'Find the first non-repeated character.': {
      code: `import java.util.LinkedHashMap;
import java.util.Map;

public static Character firstNonRepeatedCharacter(String input) {
    Map<Character, Integer> counts = new LinkedHashMap<>();
    for (char character : input.toCharArray()) {
        counts.merge(character, 1, Integer::sum);
    }

    for (Map.Entry<Character, Integer> entry : counts.entrySet()) {
        if (entry.getValue() == 1) {
            return entry.getKey();
        }
    }
    return null;
}`,
      explanation: 'LinkedHashMap preserves input order, so the second pass returns the first character whose count is exactly one.'
    },
    'Find common elements from two arrays.': {
      code: `import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;

public static Set<Integer> commonElements(int[] first, int[] second) {
    Set<Integer> left = new HashSet<>();
    for (int value : first) {
        left.add(value);
    }

    Set<Integer> common = new LinkedHashSet<>();
    for (int value : second) {
        if (left.contains(value)) {
            common.add(value);
        }
    }
    return common;
}`,
      explanation: 'Put the first array in a HashSet for fast lookups, then scan the second. LinkedHashSet keeps the answer stable in the order it appears in the second array.'
    },
    'Merge two sorted arrays.': {
      code: `public static int[] mergeSorted(int[] first, int[] second) {
    int[] merged = new int[first.length + second.length];
    int left = 0;
    int right = 0;
    int write = 0;

    while (left < first.length && right < second.length) {
        merged[write++] = first[left] <= second[right]
            ? first[left++] : second[right++];
    }
    while (left < first.length) {
        merged[write++] = first[left++];
    }
    while (right < second.length) {
        merged[write++] = second[right++];
    }
    return merged;
}`,
      explanation: 'Two pointers select the smaller current value. After one array is exhausted, copy the remaining values from the other array.'
    },
    'Implement binary search on a sorted array.': {
      code: `public static int binarySearch(int[] sorted, int target) {
    int low = 0;
    int high = sorted.length - 1;

    while (low <= high) {
        int middle = low + (high - low) / 2;
        if (sorted[middle] == target) {
            return middle;
        }
        if (sorted[middle] < target) {
            low = middle + 1;
        } else {
            high = middle - 1;
        }
    }
    return -1;
}`,
      explanation: 'Binary search requires a sorted input. Each comparison removes half of the remaining search space, giving O(log n) time.'
    },
    'Find the longest word in a sentence.': {
      code: `public static String longestWord(String sentence) {
    if (sentence == null || sentence.trim().isEmpty()) {
        return "";
    }

    String longest = "";
    for (String word : sentence.trim().split("\\s+")) {
        if (word.length() > longest.length()) {
            longest = word;
        }
    }
    return longest;
}`,
      explanation: 'After normalizing whitespace, keep the longest candidate seen so far. The strict comparison makes the first longest word win a tie.'
    },
    'Check whether one string is a rotation of another.': {
      code: `public static boolean isRotation(String first, String second) {
    if (first == null || second == null || first.length() != second.length()) {
        return false;
    }

    return (first + first).contains(second);
}`,
      explanation: 'A rotation of a string always appears inside the original string concatenated with itself, provided both inputs have equal length.'
    },
    'Find the second-highest distinct number with Stream API.': {
      code: `import java.util.Arrays;
import java.util.Comparator;
import java.util.Optional;

public static Optional<Integer> secondHighestDistinct(int[] numbers) {
    return Arrays.stream(numbers)
        .boxed()
        .distinct()
        .sorted(Comparator.reverseOrder())
        .skip(1)
        .findFirst();
}`,
      explanation: 'Box to use Comparator, remove duplicates, sort descending, skip the highest value, and return Optional for inputs with fewer than two distinct values.'
    },
    'Group employees by department using Stream API.': {
      code: `import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public static Map<String, List<Employee>> groupByDepartment(List<Employee> employees) {
    return employees.stream()
        .collect(Collectors.groupingBy(Employee::getDepartment));
}

static class Employee {
    private final String department;
    Employee(String department) { this.department = department; }
    String getDepartment() { return department; }
}`,
      explanation: 'groupingBy makes the grouping rule explicit and returns each department with its matching employee list. In production, decide how null departments should be handled.'
    },
    'Filter and transform test data using Stream API.': {
      code: `import java.util.List;
import java.util.stream.Collectors;

public static List<String> activeUserIds(List<TestUser> users) {
    return users.stream()
        .filter(TestUser::isActive)
        .map(TestUser::getId)
        .sorted()
        .collect(Collectors.toList());
}

static class TestUser {
    boolean isActive() { return true; }
    String getId() { return "user-id"; }
}`,
      explanation: 'Filter by the business rule before mapping to the required field. Sorting gives deterministic output, which makes test failures easier to compare.'
    },
    'Sort product objects by price then name.': {
      code: `import java.util.Comparator;
import java.util.List;

public static void sortProducts(List<Product> products) {
    products.sort(
        Comparator.comparing(Product::getPrice)
                  .thenComparing(Product::getName)
    );
}

static class Product {
    Integer getPrice() { return 0; }
    String getName() { return ""; }
}`,
      explanation: 'Comparator.comparing followed by thenComparing expresses the primary and tie-breaker rules without unsafe numeric subtraction.'
    },
    'Write a retry wrapper that preserves the original exception.': {
      code: `import java.util.function.Supplier;

public static <T> T retry(Supplier<T> action, int maxAttempts) {
    if (maxAttempts < 1) {
        throw new IllegalArgumentException("maxAttempts must be positive");
    }

    RuntimeException lastFailure = null;
    for (int attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return action.get();
        } catch (RuntimeException failure) {
            lastFailure = failure;
        }
    }
    throw new IllegalStateException("All retry attempts failed", lastFailure);
}`,
      explanation: 'Retry only operations known to be transient. The final exception is preserved as the cause so CI reports keep the original diagnostic.'
    },
    'How do you add JSON schema validation to REST Assured tests?': {
      code: `import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

public static void validateUserSchema() {
    given()
    .when()
        .get("/users/1")
    .then()
        .statusCode(200)
        .body(matchesJsonSchemaInClasspath("schemas/user.json"));
}`,
      explanation: 'Validate the status as well as the schema. Keep schemas versioned with the API contract and add semantic assertions for business-critical fields.'
    },
    'When should you use normalize-space(text()) in XPath?': {
      code: `By saveButton = By.xpath("//button[normalize-space(.)='Save changes']");

WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement save = wait.until(ExpectedConditions.elementToBeClickable(saveButton));
save.click();`,
      explanation: 'normalize-space trims and collapses unexpected whitespace in visible text. Combine it with an explicit wait and a stable element relationship, not as a substitute for a good locator strategy.'
    },
    'What is the difference between an Abstract Class and an Interface?': {
      code: `abstract class BasePage {
    protected final WebDriver driver;

    protected BasePage(WebDriver driver) {
        this.driver = driver;
    }

    public void refresh() {
        driver.navigate().refresh();
    }

    public abstract void waitForPageLoad();
}

interface Reporter {
    void logPass(String message);
    void logFailure(String message);
}`,
      explanation: 'An abstract class can hold shared state, constructors, and implemented behaviour. An interface defines a capability contract that unrelated classes can implement.'
    },
    'WRITTEN TEST: Explain the difference between `final`, `finally`, and `finalize`.': {
      code: `final int maxTimeoutSeconds = 30;

try {
    driver.findElement(By.id("missing")).click();
} catch (NoSuchElementException error) {
    System.out.println("Element was not found");
} finally {
    driver.quit();
}

// finalize() is legacy GC-related cleanup; do not rely on it for resources.`,
      explanation: 'final prevents reassignment, overriding, or inheritance depending on where it is used. finally runs after try/catch for cleanup; finalize is obsolete and nondeterministic.'
    }
  };

  Object.keys(defined_sections).forEach(function (sectionKey) {
    (defined_sections[sectionKey].questions || []).forEach(function (question) {
      var example = examples[question.question];
      if (!example) return;
      question.codeCommand = example.code;
      question.codeExplanation = example.explanation;
      question.expectedOutput = question.expectedOutput || 'Run the method with normal and boundary values and verify the stated return value or collection.';
    });
  });

  Object.keys(defined_sections).forEach(function (sectionKey) {
    (defined_sections[sectionKey].questions || []).forEach(function (question) {
      if (typeof question.codeCommand !== 'string' || !question.codeCommand.trim() || /^n\/a/i.test(question.codeCommand.trim())) return;
      question.codeExplanation = question.codeExplanation || question.thirtySecAnswer || 'Read the example from top to bottom, then validate its normal, boundary, and failure behaviour.';
    });
  });
})();
