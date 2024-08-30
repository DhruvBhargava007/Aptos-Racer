using UnityEngine;
using UnityEngine.SceneManagement; 

public class ButtonOption : MonoBehaviour
{
    public void PlayGame()
    {
        SceneManager.LoadScene(2); 
    }

    public void TrackSelect()
    {
        SceneManager.LoadScene(1); 
    }

    public void MainMenu()
    {
        SceneManager.LoadScene(0); 
    }

    //Below here are track selection buttons

    public void Track01()
    {
        SceneManager.LoadScene(2); 
    }
}