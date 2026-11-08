import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun WorkingInput() {
    // remember preserves the state across recompositions
    var text by remember { mutableStateOf("") }

    Column(modifier = Modifier.padding(16.dp)) {
        TextField(
            value = text,
            onValueChange = { text = it }, 
            label = { Text("Type here...") },
            modifier = Modifier.fillMaxWidth()
        )
    }
}
